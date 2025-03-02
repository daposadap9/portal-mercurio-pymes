// pages/api/graphql.js
import { ApolloServer, gql } from 'apollo-server-micro';
import sql from 'mssql';
import dotenv from 'dotenv';
import axios from 'axios'; // Se agrega Axios para la petición SOAP

dotenv.config();

// Función auxiliar que implementa la lógica de setSiguienteRadicadoNew
async function getNextRadicado() {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true"
    }
  };

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('idConfiguracion', sql.VarChar, 'NUM_CONSEC');
    request.input('nomVariable', sql.VarChar, 'RECIBIDO');
    const query = `
      SELECT DESVALOR
      FROM MERT_CONFIG 
      WHERE IDCONFIGURACION = @idConfiguracion AND NOMVARIABLE = @nomVariable
    `;
    const result = await request.query(query);
    if (result.recordset.length > 0) {
      let radicado = result.recordset[0].DESVALOR;
      const originalLength = radicado.length;
      let numRadicado = parseInt(radicado, 10);
      numRadicado++;
      radicado = numRadicado.toString();
      while (radicado.length < originalLength) {
        radicado = '0' + radicado;
      }
      return radicado;
    } else {
      throw new Error("No se encontró ningún radicado");
    }
  } catch (error) {
    console.error("Error en getNextRadicado:", error);
    throw new Error("Error al generar el radicado");
  } finally {
    sql.close();
  }
}

const typeDefs = gql`
  type Mutation {
    setSiguienteRadicadoNew: String!
    insertMertRecibido(documentInfo: String!): InsertMertRecibidoPayload!
  }
  type InsertMertRecibidoPayload {
    success: Boolean!
    message: String!
    idDocumento: String
  }
  type Query {
    _: Boolean
  }
`;

const resolvers = {
  Mutation: {
    // Mutation que devuelve el siguiente radicado
    async setSiguienteRadicadoNew() {
      return await getNextRadicado();
    },
    // Mutation para insertar en MERT_RECIBIDO y posteriormente enviar la petición SOAP
    async insertMertRecibido(_, { documentInfo }) {
      // Primero, obtenemos el radicado a utilizar
      const idDocumento = await getNextRadicado();

      const config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT, 10),
        options: {
          encrypt: process.env.DB_ENCRYPT === "true",
          trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true"
        }
      };

      try {
        await sql.connect(config);

        // Calcular la longitud, el número anterior y el siguiente
        const longitud = idDocumento.length;
        const numRadicado = parseInt(idDocumento, 10);
        let nextId = (numRadicado + 1).toString();
        while (nextId.length < longitud) {
          nextId = "0" + nextId;
        }
        let prevId = (numRadicado - 1).toString();
        while (prevId.length < longitud) {
          prevId = "0" + prevId;
        }

        // Determinar si hay cambio de año (cambioTiempo)
        const currentYear = new Date().getFullYear().toString();
        let cambioTiempo = false;
        if (idDocumento && idDocumento.length >= 4 && !idDocumento.startsWith(currentYear)) {
          cambioTiempo = true;
        }

        // Consultar existencia en MERT_RADICADO_UNICO
        const existenciaQuery = `
          SELECT IDDOCUMENTO 
          FROM MERT_RADICADO_UNICO 
          WHERE IDDOCUMENTO IN (@prevId, @currentId, @nextId)
        `;
        const requestExist = new sql.Request();
        requestExist.input('prevId', sql.VarChar, prevId);
        requestExist.input('currentId', sql.VarChar, idDocumento);
        requestExist.input('nextId', sql.VarChar, nextId);
        const existenciaResult = await requestExist.query(existenciaQuery);

        let existsPrevious = false, existsCurrent = false, existsNext = false;
        existenciaResult.recordset.forEach(row => {
          if (row.IDDOCUMENTO === prevId) {
            existsPrevious = true;
          } else if (row.IDDOCUMENTO === idDocumento) {
            existsCurrent = true;
          } else if (row.IDDOCUMENTO === nextId) {
            existsNext = true;
          }
        });

        // Validar condición: Si existe el anterior y no existe el actual ni el siguiente, o hay cambio de año
        if (!((existsPrevious && !existsCurrent && !existsNext) || cambioTiempo)) {
          throw new Error("No se cumplen las condiciones para insertar: ya existe o no hay cambio de tiempo");
        }

        // Iniciar transacción
        const transaction = new sql.Transaction();
        await transaction.begin();
        try {
          const requestTx = new sql.Request(transaction);
          // 1. Insertar en MERT_RADICADO_UNICO
          requestTx.input('idDocumento', sql.VarChar, idDocumento);
          const insertUnicoQuery = `
            INSERT INTO mert_radicado_unico (iddocumento, tipdocumento)
            VALUES (@idDocumento, 'R')
          `;
          await requestTx.query(insertUnicoQuery);

          // 2. Actualizar MERT_CONFIG
          requestTx.input('desValor', sql.VarChar, idDocumento);
          const updateConfigQuery = `
            UPDATE MERT_CONFIG
            SET DESVALOR = @desValor
            WHERE IDCONFIGURACION = 'NUM_CONSEC' AND NOMVARIABLE = 'RECIBIDO'
          `;
          await requestTx.query(updateConfigQuery);

          // 3. Insertar en MERT_RECIBIDO con valores fijos y la información del formulario
          requestTx.input('fecDocumento', sql.DateTime, new Date());
          requestTx.input('idAsociado', sql.VarChar, '800240660-2');
          requestTx.input('idGeografia', sql.VarChar, '00001');
          requestTx.input('idRemitente', sql.VarChar, '00000');
          requestTx.input('idDestinatario', sql.VarChar, 'ADMIN');
          requestTx.input('idTipo', sql.VarChar, 'D170');
          requestTx.input('idRuta', sql.VarChar, 'RUT00000000000000011');
          requestTx.input('fecOrigen', sql.DateTime, new Date());
          requestTx.input('bolAnexo', sql.VarChar, 'N');
          requestTx.input('valAnexo', sql.Int, 0);
          requestTx.input('bolRespuesta', sql.Int, 0);
          requestTx.input('obsDocumento', sql.VarChar, documentInfo);
          requestTx.input('revisado', sql.VarChar, '');
          requestTx.input('bolRuta', sql.VarChar, 'S');
          requestTx.input('idAsunto', sql.VarChar, "AP001");
          requestTx.input('fuente', sql.VarChar, 'S');
          requestTx.input('idTipoFuente', sql.VarChar, '');
          requestTx.input('idEstado', sql.VarChar, null);
          requestTx.input('folios', sql.Int, 0);
          requestTx.input('fecIndexado', sql.DateTime, new Date('1900-01-01T00:00:00'));
          requestTx.input('idPrioridad', sql.Int, 6);
          requestTx.input('numCaja', sql.VarChar, '');
          requestTx.input('idUsuarioFirma', sql.VarChar, null);
          requestTx.input('claveFirma', sql.VarChar, '');
          requestTx.input('fecFirma', sql.DateTime, null);
          requestTx.input('desDocumento', sql.VarChar, documentInfo);
          requestTx.input('idUsuarioRad', sql.VarChar, 'DPOSADA');
          requestTx.input('radicOrigen', sql.VarChar, '');
          requestTx.input('idTipoEntidad', sql.VarChar, 'TE07');
          requestTx.input('dirigidoA', sql.VarChar, '');
          requestTx.input('idSede', sql.Int, 1);
          requestTx.input('disposicion', sql.Int, 6);

          const insertRecibidoQuery = `
            INSERT INTO MERT_RECIBIDO (
              IDDOCUMENTO,
              FECDOCUMENTO,
              IDASOCIADO,
              IDGEOGRAFIA,
              IDREMITENTE,
              IDDESTINATARIO,
              IDTIPO,
              IDRUTA,
              FECORIGEN,
              BOLANEXO,
              VALANEXO,
              BOLRESPUESTA,
              OBSDOCUMENTO,
              REVISADO,
              BOLRUTA,
              IDASUNTO,
              FUENTE,
              IDTIPOFUENTE,
              IDESTADO,
              FOLIOS,
              FECINDEXADO,
              IDPRIORIDAD,
              NUMCAJA,
              IDUSUARIO_FIRMA,
              CLAVE_FIRMA,
              FECFIRMA,
              DESDOCUMENTO,
              IDUSUARIO_RAD,
              RADICORIGEN,
              IDTIPOENTIDAD,
              dirigidoA,
              ID_SEDE,
              DISPOSICION
            )
            VALUES (
              @idDocumento,
              @fecDocumento,
              @idAsociado,
              @idGeografia,
              @idRemitente,
              @idDestinatario,
              @idTipo,
              @idRuta,
              @fecOrigen,
              @bolAnexo,
              @valAnexo,
              @bolRespuesta,
              @obsDocumento,
              @revisado,
              @bolRuta,
              @idAsunto,
              @fuente,
              @idTipoFuente,
              @idEstado,
              @folios,
              @fecIndexado,
              @idPrioridad,
              @numCaja,
              @idUsuarioFirma,
              @claveFirma,
              @fecFirma,
              @desDocumento,
              @idUsuarioRad,
              @radicOrigen,
              @idTipoEntidad,
              @dirigidoA,
              @idSede,
              @disposicion
            )
          `;
          await requestTx.query(insertRecibidoQuery);

          // Confirmar la transacción
          await transaction.commit();

          // Realizar la petición SOAP al webservice
          // Cargar las variables de entorno

          const soapBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rut="http://www.servisoft.com.co/Mercurio/Servicios/Schema/RutaService">
            <soapenv:Header/>
            <soapenv:Body>
              <rut:DocumentoRutaIniciarFlujoRequest>
                <rut:idDocumento>${idDocumento}</rut:idDocumento>
                <rut:tipDocumento>R</rut:tipDocumento>
                <rut:idCondicion></rut:idCondicion>
              </rut:DocumentoRutaIniciarFlujoRequest>
            </soapenv:Body>
          </soapenv:Envelope>`;

          try {
            const soapResponse = await axios.post(process.env.SOAP_URL, soapBody, {
              headers: { 
                'Content-Type': 'text/xml',
                'SOAPAction': '' // Algunos servicios SOAP requieren esto, aunque sea vacío
              }
            });
            console.log('SOAP request successful:', soapResponse.data);
          } catch (soapError) {
            console.error('Error making SOAP request:', soapError);
          }


          return {
            success: true,
            message: 'Insert realizado exitosamente y SOAP request enviado',
            idDocumento
          };
        } catch (txError) {
          await transaction.rollback();
          throw new Error('Error en transacción: ' + txError.message);
        }
      } catch (error) {
        throw new Error('Error en insertMertRecibido: ' + error.message);
      } finally {
        sql.close();
      }
    }
  },
  Query: {
    _: () => true
  }
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
const startServer = apolloServer.start();

export default async function handler(req, res) {
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}

// Deshabilitar el body parser, ya que Apollo Server lo gestiona
export const config = {
  api: {
    bodyParser: false
  }
};

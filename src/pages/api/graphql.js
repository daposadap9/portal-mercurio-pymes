// pages/api/graphql.js

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from '@prisma/client';
import { GraphQLJSON } from 'graphql-type-json';
import { GraphQLDateTime } from 'graphql-iso-date';
import { gql } from 'graphql-tag';
import sql from 'mssql';
import dotenv from 'dotenv';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { makeExecutableSchema } from '@graphql-tools/schema';

dotenv.config();

// Clientes Prisma para operaciones generales y transacciones
const prisma = new PrismaClient();
const transactionsPrisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL },
  },
});

// Función auxiliar para obtener el siguiente radicado
async function getNextRadicado() {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    // Aumentamos timeouts y evitamos error RFC 6066
    connectionTimeout: 300000,
    requestTimeout: 300000,
    options: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
      cryptoCredentialsDetails: { servername: false },
    },
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
      let numRadicado = parseInt(radicado, 10) + 1;
      radicado = numRadicado.toString().padStart(originalLength, '0');
      return radicado;
    } else {
      throw new Error("No se encontró ningún radicado");
    }
  } catch (error) {
    console.error("Error en getNextRadicado:", error);
    throw new Error("Error al generar el radicado");
  } finally {
    await sql.close();
  }
}

const typeDefs = gql`
  scalar JSON
  scalar DateTime

  type Transaction {
    id: ID!
    userId: String!
    software: JSON
    custodia: JSON
    digitalizacion: JSON
    total: Float!
    discount: Float!
    state: String!
    createdAt: DateTime!
  }
  input TransactionInput {
    software: JSON
    custodia: JSON
    digitalizacion: JSON
    total: Float!
    discount: Float!
    state: String!
  }

  type CuidUser {
    id: ID!
    email: String!
    name: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type RegularUser {
    id: ID!
    email: String!
    name: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type CuidUserResponse { success: Boolean! message: String! user: CuidUser }
  type RegularUserResponse { success: Boolean! message: String! user: RegularUser }

  type InsertMertRecibidoPayload { success: Boolean! message: String! idDocumento: String }

  type Service {
    id: ID!
    name: String!
    icon: String
    linkUrl: String
    createdAt: DateTime!
    updatedAt: DateTime!
    options: [ServiceOption!]!
  }
  type ServiceOption {
    id: ID!
    label: String!
    value: Float!
    startup: Float
    serviceId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Mutation {
    setSiguienteRadicadoNew: String!
    insertMertRecibido(documentInfo: String!, documentInfoGeneral: String!): InsertMertRecibidoPayload!
    saveTransaction(userId: String!, input: TransactionInput!): Transaction!
    registerCuidUser(email: String!, password: String!, name: String): CuidUserResponse!
    registerRegularUser(email: String!, password: String!, name: String): RegularUserResponse!
    loginCuidUser(email: String!, password: String!): CuidUserResponse!
    loginRegularUser(email: String!, password: String!): RegularUserResponse!
    createService(name: String!, icon: String): Service!
    createServiceOption(serviceId: String!, label: String!, value: Float!, startup: Float): ServiceOption!
    updateService(id: ID!, name: String, icon: String, linkUrl: String): Service!
    updateServiceOption(id: ID!, label: String, value: Float, startup: Float): ServiceOption!
    deleteService(id: ID!): Service!
    deleteServiceOption(id: ID!): ServiceOption!
  }

  type Query {
    getTransaction(userId: String!): Transaction!
    getTotal(userId: String!): Float!
    services: [Service!]!
    _: Boolean
  }
`;

const resolvers = {
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,

  Query: {
    async getTransaction(_, { userId }) {
      const tx = await transactionsPrisma.transaction.findFirst({ where: { userId } });
      if (!tx) {
        return {
          id: "N/A",
          userId,
          software: null,
          custodia: null,
          digitalizacion: null,
          total: 0,
          discount: 0,
          state: "No hay información disponible",
          createdAt: new Date(),
        };
      }
      return tx;
    },
    async getTotal(_, { userId }) {
      const tx = await transactionsPrisma.transaction.findFirst({ where: { userId } });
      return tx ? tx.total : 0;
    },
    services: () => prisma.service.findMany({ include: { options: true } }),
    _: () => true,
  },

  Mutation: {
    setSiguienteRadicadoNew: () => getNextRadicado(),

    async insertMertRecibido(_, { documentInfo, documentInfoGeneral }) {
      const idDocumento = await getNextRadicado();
      const config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT, 10),
        connectionTimeout: 300000,
        requestTimeout: 300000,
        options: {
          encrypt: process.env.DB_ENCRYPT === "true",
          trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
          cryptoCredentialsDetails: { servername: false },
        },
      };

      try {
        await sql.connect(config);
        const longitud = idDocumento.length;
        const numRadicado = parseInt(idDocumento, 10);
        let nextId = (numRadicado + 1).toString().padStart(longitud, '0');
        let prevId = (numRadicado - 1).toString().padStart(longitud, '0');
        const currentYear = new Date().getFullYear().toString();
        const cambioTiempo = !(idDocumento.startsWith(currentYear));

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

        let existsPrevious=false, existsCurrent=false, existsNext=false;
        existenciaResult.recordset.forEach(r => {
          if (r.IDDOCUMENTO===prevId) existsPrevious=true;
          if (r.IDDOCUMENTO===idDocumento) existsCurrent=true;
          if (r.IDDOCUMENTO===nextId) existsNext=true;
        });
        if (!((existsPrevious && !existsCurrent && !existsNext) || cambioTiempo)) {
          throw new Error("Condiciones de radicado no cumplidas");
        }

        const transaction = new sql.Transaction();
        await transaction.begin();
        const req = transaction.request();
        // 1) Insertar en MERT_RADICADO_UNICO
        req.input('idDocumento', sql.VarChar, idDocumento);
        await req.query(`
          INSERT INTO MERT_RADICADO_UNICO (iddocumento, tipdocumento)
          VALUES (@idDocumento, 'R')
        `);
        // 2) Actualizar MERT_CONFIG
        req.input('desValor', sql.VarChar, idDocumento);
        await req.query(`
          UPDATE MERT_CONFIG
          SET DESVALOR=@desValor
          WHERE IDCONFIGURACION='NUM_CONSEC' AND NOMVARIABLE='RECIBIDO'
        `);
        // 3) Insertar en MERT_RECIBIDO
        req.input('fecDocumento', sql.DateTime, new Date());
        req.input('idAsociado', sql.VarChar, '800240660-2');
        req.input('idGeografia', sql.VarChar, '00001');
        req.input('idRemitente', sql.VarChar, '00000');
        req.input('idDestinatario', sql.VarChar, 'ADMIN');
        req.input('idTipo', sql.VarChar, 'D170');
        req.input('idRuta', sql.VarChar, 'RUT00000000000000011');
        req.input('fecOrigen', sql.DateTime, new Date());
        req.input('bolAnexo', sql.VarChar, 'N');
        req.input('valAnexo', sql.Int, 0);
        req.input('bolRespuesta', sql.Int, 0);
        req.input('obsDocumento', sql.VarChar, documentInfo);
        req.input('revisado', sql.VarChar, '');
        req.input('bolRuta', sql.VarChar, 'S');
        req.input('idAsunto', sql.VarChar, 'AP001');
        req.input('fuente', sql.VarChar, 'S');
        req.input('idTipoFuente', sql.VarChar, '');
        req.input('idEstado', sql.VarChar, null);
        req.input('folios', sql.Int, 0);
        req.input('fecIndexado', sql.DateTime, new Date('1900-01-01T00:00:00'));
        req.input('idPrioridad', sql.Int, 6);
        req.input('numCaja', sql.VarChar, '');
        req.input('idUsuarioFirma', sql.VarChar, null);
        req.input('claveFirma', sql.VarChar, '');
        req.input('fecFirma', sql.DateTime, null);
        req.input('desDocumento', sql.VarChar, documentInfoGeneral);
        req.input('idUsuarioRad', sql.VarChar, 'DPOSADA');
        req.input('radicOrigen', sql.VarChar, '');
        req.input('idTipoEntidad', sql.VarChar, 'TE07');
        req.input('dirigidoA', sql.VarChar, '');
        req.input('idSede', sql.Int, 1);
        req.input('disposicion', sql.Int, 6);
        await req.query(`
          INSERT INTO MERT_RECIBIDO (
            IDDOCUMENTO, FECDOCUMENTO, IDASOCIADO, IDGEOGRAFIA,
            IDREMITENTE, IDDESTINATARIO, IDTIPO, IDRUTA,
            FECORIGEN, BOLANEXO, VALANEXO, BOLRESPUESTA,
            OBSDOCUMENTO, REVISADO, BOLRUTA, IDASUNTO,
            FUENTE, IDTIPOFUENTE, IDESTADO, FOLIOS,
            FECINDEXADO, IDPRIORIDAD, NUMCAJA, IDUSUARIO_FIRMA,
            CLAVE_FIRMA, FECFIRMA, DESDOCUMENTO, IDUSUARIO_RAD,
            RADICORIGEN, IDTIPOENTIDAD, dirigidoA, ID_SEDE, DISPOSICION
          ) VALUES (
            @idDocumento, @fecDocumento, @idAsociado, @idGeografia,
            @idRemitente, @idDestinatario, @idTipo, @idRuta,
            @fecOrigen, @bolAnexo, @valAnexo, @bolRespuesta,
            @obsDocumento, @revisado, @bolRuta, @idAsunto,
            @fuente, @idTipoFuente, @idEstado, @folios,
            @fecIndexado, @idPrioridad, @numCaja, @idUsuarioFirma,
            @claveFirma, @fecFirma, @desDocumento, @idUsuarioRad,
            @radicOrigen, @idTipoEntidad, @dirigidoA, @idSede, @disposicion
          )
        `);

        await transaction.commit();

        // SOAP opcional
        const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:rut="http://www.servisoft.com.co/Mercurio/Servicios/Schema/RutaService">
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
          await axios.post(process.env.SOAP_URL, soapBody, { headers: { 'Content-Type': 'text/xml' } });
        } catch (soapErr) {
          console.error('Error SOAP:', soapErr);
        }

        return { success: true, message: 'Insert realizado exitosamente y SOAP enviado', idDocumento };
      } catch (err) {
        console.error('Error en insertMertRecibido:', err);
        throw new Error('Error en insertMertRecibido: ' + err.message);
      } finally {
        await sql.close();
      }
    },

    async saveTransaction(_, { userId, input }) {
      const discountValue = typeof input.discount === 'string'
        ? parseFloat(input.discount.replace(',', '.'))
        : input.discount;
      const dataToSave = { ...input, discount: discountValue };

      let tx = await transactionsPrisma.transaction.findFirst({ where: { userId } });
      if (tx) {
        tx = await transactionsPrisma.transaction.update({
          where: { id: tx.id },
          data: dataToSave,
        });
      } else {
        tx = await transactionsPrisma.transaction.create({
          data: { userId, ...dataToSave },
        });
      }
      return tx;
    },

    async registerCuidUser(_, { email, password, name }) {
      if (!email || !password) {
        return { success: false, message: "Email y contraseña son requeridos", user: null };
      }
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const cuidUser = await prisma.cuidUser.create({
          data: { email, password: hashedPassword, name },
        });
        return { success: true, message: "Cuid user registrado exitosamente", user: cuidUser };
      } catch (error) {
        console.error("Error registrando cuid user:", error);
        return { success: false, message: "Error registrando cuid user", user: null };
      }
    },

    async registerRegularUser(_, { email, password, name }) {
      if (!email || !password) {
        return { success: false, message: "Email y contraseña son requeridos", user: null };
      }
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const regularUser = await prisma.user.create({
          data: { email, password: hashedPassword, name },
        });
        return { success: true, message: "Regular user registrado exitosamente", user: regularUser };
      } catch (error) {
        console.error("Error registrando regular user:", error);
        return { success: false, message: "Error registrando regular user", user: null };
      }
    },

    async loginCuidUser(_, { email, password }) {
      if (!email || !password) {
        return { success: false, message: "Email y contraseña son requeridos", user: null };
      }
      try {
        const user = await prisma.cuidUser.findUnique({ where: { email } });
        if (!user) return { success: false, message: "Usuario no encontrado", user: null };
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { success: false, message: "Contraseña incorrecta", user: null };
        return { success: true, message: "Usuario logueado exitosamente", user };
      } catch (error) {
        console.error("Error en loginCuidUser:", error);
        return { success: false, message: "Error en login", user: null };
      }
    },

    async loginRegularUser(_, { email, password }) {
      if (!email || !password) {
        return { success: false, message: "Email y contraseña son requeridos", user: null };
      }
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { success: false, message: "Usuario no encontrado", user: null };
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return { success: false, message: "Contraseña incorrecta", user: null };
        return { success: true, message: "Usuario logueado exitosamente", user };
      } catch (error) {
        console.error("Error en loginRegularUser:", error);
        return { success: false, message: "Error en login", user: null };
      }
    },

    createService: (_, { name, icon }) =>
      prisma.service.create({ data: { name, icon }, include: { options: true } }),

    createServiceOption: (_, { serviceId, label, value, startup }) =>
      prisma.serviceOption.create({ data: { serviceId, label, value, startup } }),

    updateService: async (_, { id, name, icon, linkUrl }) => {
      const data = {};
      if (name    !== undefined) data.name    = name;
      if (icon    !== undefined) data.icon    = icon;
      if (linkUrl !== undefined) data.linkUrl = linkUrl;
      return prisma.service.update({
        where: { id },
        data,
        include: { options: true },
      });
    },

    updateServiceOption: (_, { id, label, value, startup }) =>
      prisma.serviceOption.update({ where: { id }, data: { label, value, startup } }),

    deleteService: async (_, { id }) => {
      await prisma.serviceOption.deleteMany({ where: { serviceId: id } });
      return prisma.service.delete({ where: { id }, include: { options: true } });
    },

    deleteServiceOption: (_, { id }) =>
      prisma.serviceOption.delete({ where: { id } }),
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ schema });

export default startServerAndCreateNextHandler(server, {
  context: async () => ({})
});

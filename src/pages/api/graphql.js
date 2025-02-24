// pages/api/graphql.js
import { ApolloServer, gql } from 'apollo-server-micro';
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Definir el schema GraphQL
const typeDefs = gql`
  type Mutation {
    setSiguienteRadicadoNew: String!
  }
  type Query {
    _: Boolean
  }
`;

// Resolver para la mutation
const resolvers = {
  Mutation: {
    async setSiguienteRadicadoNew() {
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
        // Conectar a la base de datos
        await sql.connect(config);
        const request = new sql.Request();
        request.input('idConfiguracion', sql.VarChar, 'NUM_CONSEC');
        request.input('nomVariable', sql.VarChar, 'RECIBIDO');

        // Consulta para obtener DESVALOR
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
          // Rellenar con ceros a la izquierda para mantener la longitud original
          while (radicado.length < originalLength) {
            radicado = '0' + radicado;
          }
          return radicado;
        } else {
          throw new Error("No se encontró ningún radicado");
        }
      } catch (error) {
        console.error("Error en setSiguienteRadicadoNew:", error);
        throw new Error("Error al generar el radicado");
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

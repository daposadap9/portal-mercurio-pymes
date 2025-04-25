// graphql.js

import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { PrismaClient } from '@prisma/client'
import { GraphQLJSON } from 'graphql-type-json'
import { GraphQLDateTime } from 'graphql-iso-date'
import { gql } from 'graphql-tag'
import sql from 'mssql'
import dotenv from 'dotenv'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { makeExecutableSchema } from '@graphql-tools/schema'

dotenv.config()

// Construye la cadena de conexión a SQL Server a partir de tus env vars
const connectionString = `sqlserver://${encodeURIComponent(process.env.DB_USER)}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_SERVER}:${process.env.DB_PORT};database=${process.env.DB_NAME};encrypt=${process.env.DB_ENCRYPT};trustServerCertificate=${process.env.DB_TRUST_SERVER_CERTIFICATE}`

// Un solo cliente Prisma apuntando a SQL Server
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionString
    }
  }
})

// Función auxiliar para obtener el siguiente radicado desde SQL Server
async function getNextRadicado() {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
    },
  }

  try {
    await sql.connect(config)
    const request = new sql.Request()
    request.input('idConfiguracion', sql.VarChar, 'NUM_CONSEC')
    request.input('nomVariable', sql.VarChar, 'RECIBIDO')
    const result = await request.query(`
      SELECT DESVALOR
      FROM MERT_CONFIG 
      WHERE IDCONFIGURACION = @idConfiguracion AND NOMVARIABLE = @nomVariable
    `)
    if (result.recordset.length === 0) {
      throw new Error("No se encontró ningún radicado")
    }

    let radicado = result.recordset[0].DESVALOR
    const originalLength = radicado.length
    let numRad = parseInt(radicado, 10) + 1
    radicado = numRad.toString().padStart(originalLength, '0')
    return radicado
  } catch (err) {
    console.error("Error en getNextRadicado:", err)
    throw new Error("Error al generar el radicado")
  } finally {
    await sql.close()
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
  type CuidUserResponse {
    success: Boolean!
    message: String!
    user: CuidUser
  }
  type RegularUserResponse {
    success: Boolean!
    message: String!
    user: RegularUser
  }

  type InsertMertRecibidoPayload {
    success: Boolean!
    message: String!
    idDocumento: String
  }

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
`

const resolvers = {
  JSON: GraphQLJSON,
  DateTime: GraphQLDateTime,

  Query: {
    async getTransaction(_, { userId }) {
      const tx = await prisma.transaction.findFirst({ where: { userId } })
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
        }
      }
      return tx
    },

    async getTotal(_, { userId }) {
      const tx = await prisma.transaction.findFirst({ where: { userId } })
      return tx ? tx.total : 0
    },

    services: () =>
      prisma.service.findMany({
        include: { options: true },
      }),

    _: () => true,
  },

  Mutation: {
    setSiguienteRadicadoNew: () => getNextRadicado(),

    async insertMertRecibido(_, { documentInfo, documentInfoGeneral }) {
      const idDocumento = await getNextRadicado()
      const config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT, 10),
        options: {
          encrypt: process.env.DB_ENCRYPT === "true",
          trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
        },
      }

      try {
        await sql.connect(config)
        // Cálculo de nextId y prevId
        const longitud = idDocumento.length
        const numRad = parseInt(idDocumento, 10)
        let nextId = (numRad + 1).toString().padStart(longitud, '0')
        let prevId = (numRad - 1).toString().padStart(longitud, '0')
        const currentYear = new Date().getFullYear().toString()
        const cambioTiempo = !idDocumento.startsWith(currentYear)

        // Verifica existencia
        const reqExist = new sql.Request()
        reqExist.input('prevId', sql.VarChar, prevId)
        reqExist.input('currentId', sql.VarChar, idDocumento)
        reqExist.input('nextId', sql.VarChar, nextId)
        const existRes = await reqExist.query(`
          SELECT IDDOCUMENTO 
          FROM MERT_RADICADO_UNICO 
          WHERE IDDOCUMENTO IN (@prevId, @currentId, @nextId)
        `)

        let existsPrev = false, existsCurr = false, existsNext = false
        existRes.recordset.forEach(row => {
          if (row.IDDOCUMENTO === prevId) existsPrev = true
          if (row.IDDOCUMENTO === idDocumento) existsCurr = true
          if (row.IDDOCUMENTO === nextId) existsNext = true
        })

        if (!((existsPrev && !existsCurr && !existsNext) || cambioTiempo)) {
          throw new Error("No se cumplen las condiciones para insertar")
        }

        // Transacción
        const tx = new sql.Transaction()
        await tx.begin()
        try {
          const rq = new sql.Request(tx)
          // 1. Insertar en MERT_RADICADO_UNICO
          rq.input('idDocumento', sql.VarChar, idDocumento)
          await rq.query(`
            INSERT INTO MERT_RADICADO_UNICO (iddocumento, tipdocumento)
            VALUES (@idDocumento, 'R')
          `)
          // 2. Actualizar MERT_CONFIG
          rq.input('desValor', sql.VarChar, idDocumento)
          await rq.query(`
            UPDATE MERT_CONFIG
            SET DESVALOR = @desValor
            WHERE IDCONFIGURACION = 'NUM_CONSEC' AND NOMVARIABLE = 'RECIBIDO'
          `)
          // 3. Insertar en MERT_RECIBIDO
          rq
            .input('fecDocumento', sql.DateTime, new Date())
            .input('idAsociado', sql.VarChar, '800240660-2')
            .input('idGeografia', sql.VarChar, '00001')
            .input('idRemitente', sql.VarChar, '00000')
            .input('idDestinatario', sql.VarChar, 'ADMIN')
            .input('idTipo', sql.VarChar, 'D170')
            .input('idRuta', sql.VarChar, 'RUT00000000000000011')
            .input('fecOrigen', sql.DateTime, new Date())
            .input('bolAnexo', sql.VarChar, 'N')
            .input('valAnexo', sql.Int, 0)
            .input('bolRespuesta', sql.Int, 0)
            .input('obsDocumento', sql.VarChar, documentInfo)
            .input('revisado', sql.VarChar, '')
            .input('bolRuta', sql.VarChar, 'S')
            .input('idAsunto', sql.VarChar, 'AP001')
            .input('fuente', sql.VarChar, 'S')
            .input('idTipoFuente', sql.VarChar, '')
            .input('idEstado', sql.VarChar, null)
            .input('folios', sql.Int, 0)
            .input('fecIndexado', sql.DateTime, new Date('1900-01-01T00:00:00'))
            .input('idPrioridad', sql.Int, 6)
            .input('numCaja', sql.VarChar, '')
            .input('idUsuarioFirma', sql.VarChar, null)
            .input('claveFirma', sql.VarChar, '')
            .input('fecFirma', sql.DateTime, null)
            .input('desDocumento', sql.VarChar, documentInfoGeneral)
            .input('idUsuarioRad', sql.VarChar, 'DPOSADA')
            .input('radicOrigen', sql.VarChar, '')
            .input('idTipoEntidad', sql.VarChar, 'TE07')
            .input('dirigidoA', sql.VarChar, '')
            .input('idSede', sql.Int, 1)
            .input('disposicion', sql.Int, 6)

          await rq.query(`
            INSERT INTO MERT_RECIBIDO (
              IDDOCUMENTO, FECDOCUMENTO, IDASOCIADO, IDGEOGRAFIA, IDREMITENTE,
              IDDESTINATARIO, IDTIPO, IDRUTA, FECORIGEN, BOLANEXO, VALANEXO,
              BOLRESPUESTA, OBSDOCUMENTO, REVISADO, BOLRUTA, IDASUNTO, FUENTE,
              IDTIPOFUENTE, IDESTADO, FOLIOS, FECINDEXADO, IDPRIORIDAD,
              NUMCAJA, IDUSUARIO_FIRMA, CLAVE_FIRMA, FECFIRMA, DESDOCUMENTO,
              IDUSUARIO_RAD, RADICORIGEN, IDTIPOENTIDAD, dirigidoA, ID_SEDE,
              DISPOSICION
            ) VALUES (
              @idDocumento, @fecDocumento, @idAsociado, @idGeografia, @idRemitente,
              @idDestinatario, @idTipo, @idRuta, @fecOrigen, @bolAnexo, @valAnexo,
              @bolRespuesta, @obsDocumento, @revisado, @bolRuta, @idAsunto, @fuente,
              @idTipoFuente, @idEstado, @folios, @fecIndexado, @idPrioridad,
              @numCaja, @idUsuarioFirma, @claveFirma, @fecFirma, @desDocumento,
              @idUsuarioRad, @radicOrigen, @idTipoEntidad, @dirigidoA, @idSede,
              @disposicion
            )
          `)

          await tx.commit()
        } catch (txErr) {
          await tx.rollback()
          throw new Error("Error en transacción: " + txErr.message)
        }

        // Lanza petición SOAP opcional
        const soapBody = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:rut="http://www.servisoft.com.co/Mercurio/Servicios/Schema/RutaService">
            <soapenv:Header/>
            <soapenv:Body>
              <rut:DocumentoRutaIniciarFlujoRequest>
                <rut:idDocumento>${idDocumento}</rut:idDocumento>
                <rut:tipDocumento>R</rut:tipDocumento>
                <rut:idCondicion></rut:idCondicion>
              </rut:DocumentoRutaIniciarFlujoRequest>
            </soapenv:Body>
          </soapenv:Envelope>
        `
        try {
          await axios.post(process.env.SOAP_URL, soapBody, {
            headers: { 'Content-Type': 'text/xml', 'SOAPAction': '' }
          })
        } catch (soapErr) {
          console.error("Error en petición SOAP:", soapErr)
        }

        return {
          success: true,
          message: 'Insert realizado exitosamente y SOAP request enviado',
          idDocumento
        }
      } catch (err) {
        throw new Error("Error en insertMertRecibido: " + err.message)
      } finally {
        await sql.close()
      }
    },

    async saveTransaction(_, { userId, input }) {
      const discountValue =
        typeof input.discount === 'string'
          ? parseFloat(input.discount.replace(',', '.'))
          : input.discount

      let txRec = await prisma.transaction.findFirst({ where: { userId } })
      if (txRec) {
        txRec = await prisma.transaction.update({
          where: { id: txRec.id },
          data: { ...input, discount: discountValue }
        })
      } else {
        txRec = await prisma.transaction.create({
          data: { userId, ...input, discount: discountValue }
        })
      }
      return txRec
    },

    // Usuarios
    async registerCuidUser(_, { email, password, name }) {
      if (!email || !password) {
        return { success: false, message: "Email y contraseña son requeridos", user: null }
      }
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)
      const user = await prisma.cuidUser.create({
        data: { email, password: hashed, name }
      })
      return { success: true, message: "Usuario registrado", user }
    },

    async registerRegularUser(_, { email, password, name }) {
      if (!email || !password) {
        return { success: false, message: "Email y contraseña son requeridos", user: null }
      }
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)
      const user = await prisma.user.create({
        data: { email, password: hashed, name }
      })
      return { success: true, message: "Usuario registrado", user }
    },

    async loginCuidUser(_, { email, password }) {
      if (!email || !password) {
        return { success: false, message: "Email y contraseña son requeridos", user: null }
      }
      const user = await prisma.cuidUser.findUnique({ where: { email } })
      if (!user) return { success: false, message: "Usuario no encontrado", user: null }
      const match = await bcrypt.compare(password, user.password)
      if (!match) return { success: false, message: "Contraseña incorrecta", user: null }
      return { success: true, message: "Login exitoso", user }
    },

    async loginRegularUser(_, { email, password }) {
      if (!email || !password) {
        return { success: false, message: "Email y contraseña son requeridos", user: null }
      }
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return { success: false, message: "Usuario no encontrado", user: null }
      const match = await bcrypt.compare(password, user.password)
      if (!match) return { success: false, message: "Contraseña incorrecta", user: null }
      return { success: true, message: "Login exitoso", user }
    },

    // Servicios
    createService: (_, { name, icon }) =>
      prisma.service.create({ data: { name, icon }, include: { options: true } }),

    createServiceOption: (_, { serviceId, label, value, startup }) =>
      prisma.serviceOption.create({ data: { serviceId, label, value, startup } }),

    updateService: async (_, { id, name, icon, linkUrl }) => {
      const data = {}
      if (name !== undefined) data.name = name
      if (icon !== undefined) data.icon = icon
      if (linkUrl !== undefined) data.linkUrl = linkUrl
      return prisma.service.update({
        where: { id },
        data,
        include: { options: true }
      })
    },

    updateServiceOption: (_, { id, label, value, startup }) =>
      prisma.serviceOption.update({
        where: { id },
        data: { label, value, startup }
      }),

    deleteService: async (_, { id }) => {
      await prisma.serviceOption.deleteMany({ where: { serviceId: id } })
      return prisma.service.delete({ where: { id }, include: { options: true } })
    },

    deleteServiceOption: (_, { id }) =>
      prisma.serviceOption.delete({ where: { id } }),
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })
const server = new ApolloServer({ schema })

export default startServerAndCreateNextHandler(server, {
  context: async () => ({})
})

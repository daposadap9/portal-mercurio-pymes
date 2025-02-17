// src/lib/db.js
import sql from 'mssql';

// Configuración del pool de conexión
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Habilita encriptación SSL
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true', // Acepta certificados autofirmados
  },
};

// Función para conectarse a la base de datos
let pool;

export async function connectDB() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✅ Conexión a SQL Server establecida');
    }
    return pool;
  } catch (err) {
    console.error('❌ Error al conectar a SQL Server:', err);
    throw new Error('Error al conectar a la base de datos');
  }
}

export { sql };

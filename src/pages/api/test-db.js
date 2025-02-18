import { connectDB, sql } from "@/lib/db";

export default async function handler(req, res) {
  try {
    // Conecta a la base de datos
    const pool = await connectDB();

    // Obtener el idDocumento desde req.query (GET) o req.body (POST)
    const { idDocumento } = req.method === "GET" ? req.query : req.body;

    // Validar que idDocumento esté presente
    if (!idDocumento) {
      return res.status(400).json({ success: false, error: "Falta el parámetro 'idDocumento'" });
    }

    // Ejecutar la consulta que trae solo IDDOCUMENTO y ESTDOCUMENTO con la conversión solicitada
    const query = `
      SELECT IDDOCUMENTO,
             'Evacuado' AS ESTDOCUMENTO
      FROM MERT_RECIBIDO 
      WHERE IDDOCUMENTO = @idDocumento

      UNION 

      SELECT MFR.IDDOCUMENTO,
             CASE 
               WHEN MFR.ESTDOCUMENTO = 'P' THEN 'Pendiente'
               WHEN MFR.ESTDOCUMENTO = 'F' THEN 'Finalizado'
               WHEN MFR.ESTDOCUMENTO = 'E' THEN 'Evacuado'
               ELSE MFR.ESTDOCUMENTO
             END AS ESTDOCUMENTO
      FROM MERT_FLUJO_RUTA MFR
      JOIN MERT_RECIBIDO MR ON MFR.IDDOCUMENTO = MR.IDDOCUMENTO
      WHERE MFR.IDDOCUMENTO = @idDocumento

      UNION  

      SELECT MB.IDDOCUMENTO,
             CASE 
               WHEN MB.ESTDOCUMENTO = 'P' THEN 'Pendiente'
               WHEN MB.ESTDOCUMENTO = 'F' THEN 'Finalizado'
               WHEN MB.ESTDOCUMENTO = 'E' THEN 'Evacuado'
               ELSE MB.ESTDOCUMENTO
             END AS ESTDOCUMENTO
      FROM MERT_BITACORA MB
      JOIN MERT_RECIBIDO MR ON MB.IDDOCUMENTO = MR.IDDOCUMENTO
      WHERE MB.IDDOCUMENTO = @idDocumento

      ORDER BY IDDOCUMENTO;
    `;

    const result = await pool
      .request()
      .input("idDocumento", sql.VarChar, idDocumento)
      .query(query);

    // Responder con los resultados
    res.status(200).json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("❌ Error al ejecutar la consulta:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
}

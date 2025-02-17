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

    // Ejecutar la consulta con el parámetro dinámico
    const result = await pool
      .request()
      .input("idDocumento", sql.VarChar, idDocumento)
      .query(`
        SELECT MR.IDDOCUMENTO, MR.IDUSUARIO_RAD, MR.FECDOCUMENTO, MR.FECDOCUMENTO, 'RADICACION' AS Tipo, 0 AS VALPASO, 'E' AS ESTDOCUMENTO
        FROM MERT_RECIBIDO MR 
        WHERE MR.IDDOCUMENTO = @idDocumento

        UNION 

        SELECT MFR.IDDOCUMENTO, MFR.IDUBICACION, MFR.FECENTRADA, MFR.FECSALIDA, MFR.IDRUTA, MFR.VALPASO, MFR.ESTDOCUMENTO
        FROM MERT_FLUJO_RUTA MFR
        JOIN MERT_RECIBIDO MR ON MFR.IDDOCUMENTO = MR.IDDOCUMENTO
        WHERE MFR.IDDOCUMENTO = @idDocumento

        UNION  

        SELECT MB.IDDOCUMENTO, MB.IDUBICACION, MB.FECENTRADA, MB.FECSALIDA, 'DESTINATARIO' AS Tipo, '' AS VALPASO, MB.ESTDOCUMENTO
        FROM MERT_BITACORA MB
        JOIN MERT_RECIBIDO MR ON MB.IDDOCUMENTO = MR.IDDOCUMENTO
        WHERE MB.IDDOCUMENTO = @idDocumento

        ORDER BY 3, 6;
      `);

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

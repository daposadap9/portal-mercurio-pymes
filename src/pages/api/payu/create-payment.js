// pages/api/payu/create-payment.js
import fetch from 'node-fetch';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    const { banco, nombre, documento, email, telefono, total } = req.body;
    
    // Validar que notifyUrl esté definida
    if (!process.env.PAYU_NOTIFY_URL) {
      return res.status(500).json({ error: "La variable de entorno PAYU_NOTIFY_URL no está definida." });
    }
    
    // Definir valores necesarios
    const referenceCode = `ref-${Date.now()}`;
    const currency = 'COP';
    
    // Generar la firma digital usando la fórmula:
    // MD5(apiKey~accountId~referenceCode~TX_VALUE~currency)
    const signatureString = `${process.env.PAYU_API_KEY}~${process.env.PAYU_ACCOUNT_ID}~${referenceCode}~${total}~${currency}`;
    const signature = crypto.createHash('md5').update(signatureString).digest('hex');

    // Obtener la IP. Si es "::1", se reemplaza por "127.0.0.1"
    let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ipAddress === '::1') {
      ipAddress = '127.0.0.1';
    }

    // Construir el payload de acuerdo con la documentación de PayU Sandbox para pagos PSE.
    const payload = {
      language: "es",
      command: "SUBMIT_TRANSACTION",
      merchant: {
        apiKey: process.env.PAYU_API_KEY,
        apiLogin: process.env.PAYU_API_LOGIN
      },
      transaction: {
        order: {
          accountId: process.env.PAYU_ACCOUNT_ID,
          referenceCode: referenceCode,
          description: "Pago por PSE",
          language: "es",
          signature: signature,
          notifyUrl: process.env.PAYU_NOTIFY_URL,
          additionalValues: {
            TX_VALUE: {
              value: total,
              currency: currency
            }
          },
          buyer: {
            merchantBuyerId: documento,
            fullName: nombre,
            emailAddress: "pruebas@payulatam.com", // Correo de prueba para Sandbox.
            contactPhone: telefono,
            dniNumber: documento,
            shippingAddress: {
              street1: "Calle 123",
              city: "Bogotá",
              country: "CO"
            }
          }
        },
        extraParameters: {
          FINANCIAL_INSTITUTION_CODE: "1022"
        },
        type: "AUTHORIZATION_AND_CAPTURE",
        paymentMethod: "PSE",
        paymentCountry: "CO",
        deviceSessionId: `${Date.now()}`,
        ipAddress: ipAddress,
        cookie: req.headers.cookie || "",
        userAgent: req.headers["user-agent"]
      },
      test: true
    };

    console.log('PAYU_SANDBOX_URL:', process.env.PAYU_SANDBOX_URL);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(process.env.PAYU_SANDBOX_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Si la respuesta no es JSON, la leemos como texto (para depurar)
      const text = await response.text();
      console.error("Respuesta no JSON:", text);
      return res.status(500).json({ error: 'La respuesta no tiene formato JSON', data: text });
    }
    
    console.log('Response:', data);

    // Se asume que la respuesta incluye la URL de pago en data.transactionResponse.extraParameters.URL_PAYMENT_RECEIPT_HTML
    if (
      data &&
      data.transactionResponse &&
      data.transactionResponse.extraParameters &&
      data.transactionResponse.extraParameters.URL_PAYMENT_RECEIPT_HTML
    ) {
      const redirectUrl = data.transactionResponse.extraParameters.URL_PAYMENT_RECEIPT_HTML;
      return res.status(200).json({ redirectUrl });
    } else {
      return res.status(400).json({ error: 'No se pudo generar la URL de pago', data });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.toString() });
  }
}

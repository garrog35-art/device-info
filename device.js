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

  // ✅ TU MENSAJE (lo que ya tenías)
  const mensaje = `
🚨 *NUEVA VISITA DETECTADA*

🌐 RED
IP: ${data.ip || "Desconocida"}
País: ${data.country || "Desconocido"}
Ciudad: ${data.city || "Desconocida"}
ISP: ${data.isp || "Desconocido"}
Tipo: ${data.tipoRed || "Desconocido"}
Velocidad: ${data.velocidad || "Desconocida"}
Latencia: ${data.latencia || "Desconocida"}

📱 DISPOSITIVO
Sistema: ${data.sistema || "Desconocido"}
Navegador: ${data.navegador || "Desconocido"}
Versión: ${data.versionNavegador || "Desconocida"}
Tipo: ${data.tipo || "Desconocido"}
RAM: ${data.ram || "Desconocida"}
Núcleos: ${data.nucleos || "Desconocido"}
Pantalla Táctil: ${data.soporteTactil || "❌ No"}

🖥️ PANTALLA
Resolución: ${data.resolucion || "Desconocida"}
Ventana: ${data.ventana || "Desconocida"}
Densidad: ${data.pixeles || "Desconocida"}
Color: ${data.profundidadColor || "Desconocida"}
Orientación: ${data.orientacion || "Desconocida"}
Modo Oscuro: ${data.modoOscuro || "Desconocido"}

🔋 BATERÍA
Nivel: ${data.bateriaNivel || "Desconocido"}
Estado: ${data.bateriaEstado || "Desconocido"}

🌎 UBICACIÓN
Idioma: ${data.idioma || "Desconocido"}
Zona Horaria: ${data.zonaHoraria || "Desconocida"}
Fecha/Hora: ${data.fechaLocal || "Desconocida"}
Latitud: ${data.lat || "No solicitada"}
Longitud: ${data.lon || "No solicitada"}

🔒 SEGURIDAD
HTTPS: ${data.https || "Desconocido"}
Cookies: ${data.cookies || "Desconocido"}

🧪 SOPORTE TECNOLOGÍAS
WebGL: ${data.webgl || "Desconocido"}
WebRTC: ${data.webrtc || "Desconocido"}
Bluetooth: ${data.bluetooth || "Desconocido"}
Notificaciones: ${data.notificaciones || "Desconocido"}
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


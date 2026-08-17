const mensaje = `
🚨 *NUEVA VISITA DETECTADA*

🌐 RED
IP: ${ip}
País: ${event.headers["x-country"] || "Desconocido"}
Ciudad: ${event.headers["x-city"] || "Desconocida"}
ISP: ${event.headers["x-isp"] || "Desconocido"}
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

🔒 SEGURIDAD
HTTPS: ${data.https || "Desconocido"}
Cookies: ${data.cookies || "Desconocido"}

🧪 SOPORTE
WebGL: ${data.webgl || "Desconocido"}
WebRTC: ${data.webrtc || "Desconocido"}
`.trim();


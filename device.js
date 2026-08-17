const mensaje = `
📱 *NUEVA VISITA — Device Info*

🌐 RED
IP: ${data.ip || "Desconocida"}
País: ${data.country || "Desconocido"}
Ciudad: ${data.city || "Desconocida"}
ISP: ${data.isp || "Desconocido"}
Conexión: ${data.conexion || "Desconocida"}
Tipo: ${data.tipoRed || "Desconocido"}

📱 DISPOSITIVO
Sistema: ${data.os || "Desconocido"}
Navegador: ${data.browser || "Desconocido"}
Tipo: ${data.dispositivo || "Desconocido"}
RAM: ${data.ram || "Desconocida"}
Núcleos: ${data.nucleos || "Desconocido"}
Pantalla: ${data.pantalla || "Desconocida"}
Densidad: ${data.pixelRatio || "Desconocido"}

🔋 ESTADO
Batería: ${data.battery || "Desconocida"}
Carga: ${data.cargando || "Desconocido"}

🌎 UBICACIÓN
Idioma: ${data.idioma || "Desconocido"}
Zona: ${data.zonaHoraria || "Desconocida"}

🔒 EXTRAS
Pantalla táctil: ${data.toque || "❌ No"}
Cookies: ${data.cookies || "❌ No"}
`.trim();


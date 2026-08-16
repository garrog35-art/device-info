exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: "Method Not Allowed"
            })
        };
    }

    try {
        const data = JSON.parse(event.body || "{}");

        console.log("Datos recibidos:", data);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                success: true,
                message: "Información recibida correctamente"
            })
        };

    } catch (error) {
        console.error(error);

        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                success: false,
                error: "JSON inválido"
            })
        };
    }
};



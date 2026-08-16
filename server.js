const express = require("express");
const Groq = require("groq-sdk");

const app = express();

app.use(express.json());
app.use(express.static("."));

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/api/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                error: "No message provided"
            });
        }

        const completion = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are JIL AI, a friendly, helpful AI assistant."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.1-8b-instant"
        });

        res.json({
            reply: completion.choices[0].message.content
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "JIL's AI brain could not respond."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`JIL AI running on port ${PORT}`);
});

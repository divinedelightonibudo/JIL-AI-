```javascript
const express = require("express");
const Groq = require("groq-sdk");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    console.error("ERROR: GROQ_API_KEY is not set in Render.");
}

const client = new Groq({
    apiKey: apiKey
});


app.post("/api/chat", async (req, res) => {

    try {

        const message = req.body?.message;

        if (!message || typeof message !== "string") {

            return res.status(400).json({
                error: "Please enter a message."
            });

        }


        if (!apiKey) {

            return res.status(500).json({
                error: "JIL's AI key is not configured on the server."
            });

        }


        console.log("JIL received a message.");


        const completion =
            await client.chat.completions.create({

                model: "llama-3.1-8b-instant",

                messages: [

                    {
                        role: "system",

                        content:
                            "You are JIL AI, a friendly, helpful and intelligent AI assistant. " +
                            "Give clear, useful answers. Be friendly and concise when appropriate."
                    },

                    {
                        role: "user",

                        content: message
                    }

                ]

            });


        const reply =
            completion?.choices?.[0]?.message?.content;


        if (!reply) {

            console.error(
                "Groq returned no message."
            );

            return res.status(500).json({
                error: "The AI returned an empty response."
            });

        }


        console.log("JIL successfully generated a reply.");

        res.json({
            reply: reply
        });


    } catch (error) {

        console.error(
            "JIL AI ERROR:",
            error?.message || error
        );


        res.status(500).json({

            error:
                "The AI server could not respond. " +
                "Check the Render logs for the exact error."

        });

    }

});


const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `JIL AI server running on port ${PORT}`
        );

    }
);
```

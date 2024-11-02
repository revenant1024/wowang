import OpenAI from 'openai';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getChatCompletion(userMessage) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신은 매혹적인 마녀입니다. 최대한 설레게 말해주세요. 쿨하고 짧게 대답해주세요." },
                { role: "user", content: userMessage }
            ]
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        throw error;
    }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/hallo', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const hallo = await getChatCompletion(userMessage);
        res.json({ response: hallo });
    } catch (error) {
        res.status(500).json({ error: 'Error occurred while fetching the response.' });
    }
});

const PORT = process.env.PORT || 3000; // 기본 포트 설정

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

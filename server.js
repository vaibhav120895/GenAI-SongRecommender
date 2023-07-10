require('dotenv').config()
const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

app.use(express.static(path.join(__dirname, '/'))); // Serving static files

app.use(express.json()); // to support JSON-encoded bodies

app.post('/api/getSongRecommendations', async (req, res) => {
    try {
        const genre = req.body.genre;
        const mood = req.body.mood.trim();
        let prompt;
        if (genre && mood) {
            prompt = `As a music recommendation AI, recommend some songs for a fan of ${genre} who is in a ${mood} mood.`;
        } else if (genre) {
            prompt = `As a music recommendation AI, recommend some songs for a fan of ${genre}.`;
        } else if (mood) {
            prompt = `As a music recommendation AI, recommend some songs for someone who is in a ${mood} mood.`;
        } else {
            // If neither genre nor mood is provided, send an error response
            res.json({ error: 'No genre or mood provided.' });
            return;
        }
        
        const gpt3Response = await axios.post('https://api.openai.com/v1/completions', {
            prompt: `As a music recommendation AI, recommend some songs for a fan of ${genre}.`,
            max_tokens: 200,
            model: 'text-davinci-002',
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (typeof gpt3Response.data.choices[0].text === 'string') {
            res.json({ recommendations: gpt3Response.data.choices[0].text.trim().split('\n') });
        } else {
            res.json({ error: 'Unexpected format in GPT-3 response.' });
        }
    } catch (error) {
        console.log('Error name: ', error.name);
        console.log('Error message: ', error.message);
        console.log('Error stack: ', error.stack);
        if (error.response) {
            console.log('GPT-3 API Response Error: ', error.response.data);
        }
        res.json({ error: 'Something went wrong while fetching recommendations.' });
    }
});

const port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

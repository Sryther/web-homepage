require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const pexels = require('pexels');

const app = express();

const pexelsApp = pexels.createClient(process.env.PEXELS_API_KEY);

const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/random', async (req, res) => {
    const response = await pexelsApp.photos.search({
        page: Math.floor(1000 * Math.random()),
        per_page: 1,
        orientation: 'landscape',
        locale: 'fr-FR',
        query: 'nature'
    });
    res.send(response.photos[0].src.large2x);
});

app.use('/assets', express.static('assets'));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});

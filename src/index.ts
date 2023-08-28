import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import pexels from 'pexels';
import { AsyncWeather } from '@cicciosgamino/openweather-apis';

const __dirname = path.resolve();

const app = express();

const pexelsApp = pexels.createClient(process.env.PEXELS_API_KEY);

const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/index.html'));
});

app.get('/random', async (req, res) => {
    const pexelsQuery = {
        page: Math.floor(1000 * Math.random()),
        per_page: 1,
        orientation: 'landscape',
        locale: 'en-US',
        query: 'nature'
    };

    const weather = await new AsyncWeather();
    weather.setApiKey(process.env.OPENWEATHER_API_KEY);
    weather.setUnits('metric');
    weather.setCoordinates(43.7610502, 1.040338);
    weather.setLang('fr');
    const resultWeather = await weather.getAllWeather();

    if (resultWeather.weather[0].icon.indexOf("n") !== -1) {
        pexelsQuery.query = "universe"
        pexelsQuery.page = Math.floor(100 * Math.random())
    }

    try {
        const response = await pexelsApp.photos.search(pexelsQuery);

        let photo: null;
        if (response["photos"][0].src.large2x) {
            photo = response["photos"][0].src.large2x;
        } else {
            photo = response["photos"][0].src.large;
        }

        res.send(photo);
    } catch (error) {
        console.error(error);
        res.send('/assets/default-background.png');
    }
});

app.use('/assets', express.static('assets'));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});

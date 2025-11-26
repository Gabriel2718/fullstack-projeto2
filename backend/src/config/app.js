import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import https from 'https';
import fs from 'fs';
import { route as gameController } from '../routes/GameController.js';
import { route as userController } from '../routes/UserController.js';

const app = express();

const globalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 10
})

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    message: {
        status: "Error",
        description: "Too many requests, please try again later"
    }
})

app.use(compression())
app.use(express.json());
app.use(cors());
app.use('/games', globalLimiter, gameController);
app.use('/login', loginLimiter , userController);

const httpsOptions = {
    key: fs.readFileSync('../../privkey.pem'),
    cert: fs.readFileSync('../../cert.pem')
};

https.createServer(httpsOptions, app).listen(process.env.PORT_HTTPS, () => {
    console.log(`Listening at ${process.env.PORT_HTTPS}...`)
});

/*app.listen(process.env.PORT, () => {
    console.log(`Listening at ${process.env.PORT}...`);
});*/
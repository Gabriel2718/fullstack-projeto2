import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { route as gameController } from './src/routes/GameController.js';
import { route as userController } from './src/routes/UserController.js';
//import { CacheManager } from './src/config/CacheManager.js';
/*const cacheManager = await CacheManager.getInstance();
console.log(cacheManager.games);*/

const app = express();

app.use(express.json());
app.use(cors());
app.use('/games', gameController);
app.use('/users', userController);

app.listen(process.env.PORT, () => {
    console.log(`Listening at ${process.env.PORT}...`);
});
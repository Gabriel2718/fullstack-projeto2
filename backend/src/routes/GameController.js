import express from 'express';
import { GameRepositoryMongo } from '../config/GameRepositoryMongo.js';
import { GameService } from '../config/GameService.js';
import { Game } from '../models/Game.js'
import { authMiddleware } from '../config/AuthMiddleware.js';
import { CacheManager } from '../config/CacheManager.js';
import { GamePostValidator } from '../config/GamePostValidator.js';

const service = new GameService(
    await GameRepositoryMongo.create(),
    await CacheManager.getInstance(),
    await GamePostValidator.getInstance()
);

const route = express.Router();

route.get("/", (req, res) => {
    let { title, pageNumber } = req.query;
    if(!pageNumber) pageNumber = 0;

    if(title) {
        return service.getGameByTitle(title)
        .then(response => {
            res.json(response);
        });
    }

    return service.getPaginatedGames(pageNumber)
    .then(response => {
        res.json(response);
    });
    /*return service.getAllGames()
    .then(response => {
        res.json(response);
    });*/
});

route.post("/", authMiddleware, (req, res) => {
    const { 
        title,
        imageUrl,
        normalPrice,
        salePrice,
        storeUrl
    } = req.body;

    try{
        return service.insertGame(new Game(
            title,
            imageUrl,
            normalPrice,
            salePrice,
            storeUrl
        )).then(response => {
            if(response.status == process.env.SUCCESS_MESSAGE) {
                res.status(200);
            } else {
                res.status(409);
            }
            res.json(response);
        });
    } catch(error) {
        return res.status(500).json({ message: 'Internal server error' });
    };
});

/*route.put("/", authMiddleware, (req, res) => {
    const { 
        title,
        imageUrl,
        normalPrice,
        salePrice,
        storeUrl
    } = req.body;

    try{
        return service.updateByTitle(new Game(
            title,
            imageUrl,
            normalPrice,
            salePrice,
            storeUrl
        )).then(response => {
            if(response.status == process.env.SUCCESS_MESSAGE) {
                res.status(200);
            } else {
                res.status(409);
            }
            res.json(response);
        });
    } catch(error) {
        return res.status(500).json({ message: 'Internal server error' });
    };
});

route.delete("/", authMiddleware, (req, res) => {
    const { title } = req.body;
    try{
        return service.deleteByTitle(title)
        .then(response => {
            if(response.status == process.env.SUCCESS_MESSAGE) {
                res.status(200);
            } else {
                res.status(409);
            }
            res.json(response);
        });
    } catch(error) {
        return res.status(500).json({ message: 'Internal server error' });
    };
});*/

export { route };
import express from 'express';
import { GameRepositoryMongo } from '../config/repositories/GameRepositoryMongo.js';
import { GameService } from '../config/services/GameService.js';
import { Game } from '../models/Game.js'
import { authMiddleware } from '../config/AuthMiddleware.js';
import { CacheManager } from '../config/CacheManager.js';
import { GamePostValidator } from '../config/GamePostValidator.js';
import validator from "validator";
import { body, query, validationResult } from 'express-validator';
import logger from '../config/Logger.js';

const gamePostValidator = await GamePostValidator.getInstance();
const repository = await GameRepositoryMongo.getInstance();
const cacheManager = await CacheManager.getInstance(repository);

const service = new GameService(
    repository,
    cacheManager,
    gamePostValidator
);

const route = express.Router();

route.get(
    "/", 
    [
        query('pageNumber')
            .optional()
            .isInt({ min: 0 })
            .toInt(),
        query('title')
            .optional()
            .trim()
            .escape()
            .isLength({ min: 1 })
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json([]);
        }
        next();
    },
    (req, res) => {
        let { title, pageNumber } = req.query;
        if(!pageNumber) pageNumber = 0;

        logger.info(`Search from ${req.ip}`);

        if(title) {
            title = validator.escape(validator.trim(title));
            return service.getGameByTitle(title)
            .then(response => {
                res.json(response);
            });
        }

        return service.getPaginatedGames(pageNumber)
        .then(response => {
            res.json(response);
        });
    }
);

route.post("/", [
        body("title").trim().escape(),
        body("imageUrl").trim().isURL(),
        body("normalPrice").trim().toFloat(),
        body("salePrice").trim().toFloat(),
        body("storeUrl").trim().isURL()
    ], 
    /*(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "Error",
                errors: errors.array()
            });
        }
        next();
    },*/
    authMiddleware, 
    async (req, res) => {
        const { 
            title,
            imageUrl,
            normalPrice,
            salePrice,
            storeUrl
        } = req.body;

        try{
            const result = await service.insertGame(new Game(
                title,
                imageUrl,
                normalPrice,
                salePrice,
                storeUrl
            ));
            if(!result.valid) {
                return res.status(400).json({
                    status: "Error",
                    errors: result.errors
                });
            }

            logger.info(`Game "${title}" has been added`);

            return res.status(200).json({
                status: process.env.SUCCESS_MESSAGE
            });
        } catch(error) {
            logger.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        };
    }
);

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
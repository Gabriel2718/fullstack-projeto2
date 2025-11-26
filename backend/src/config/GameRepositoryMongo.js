import dotenv from 'dotenv';
dotenv.config();

import { CacheManager } from './CacheManager.js';
import { db } from './db.js';

export class GameRepositoryMongo {
    static instance = null;

    constructor(collection, cacheManager) {
        if(GameRepositoryMongo.instance) {
            return GameRepositoryMongo.instance
        }
        this.collection = collection;
        this.cacheManager = cacheManager;
        GameRepositoryMongo.instance = this;
    }

    static async getInstance() {
        if(!GameRepositoryMongo.instance) {
            const collection = db.collection(process.env.GAME_COLLECTION);

            const cacheManager = await CacheManager.getInstance();
            GameRepositoryMongo.instance = new GameRepositoryMongo(collection, cacheManager);
            GameRepositoryMongo.instance.reloadCache();
        }
        return GameRepositoryMongo.instance;
    }

    async reloadCache() {
        await this.cacheManager.reloadCache(await this.getAllGames());
    }

    async insertGame(game) {
        await this.collection.insertOne(game);
        this.cacheManager.setGame(game);
    }

    async getAllGames() {
        return await this.collection.find().toArray();
    }

    async getGameByTitle(game) {
        return await this.collection.find({ title: game }).toArray();
    }

    /*async updateByTitle(game) {
        await this.collection.updateOne(
            { title: game.title },
            { $set: game }
        );
    }

    async deleteByTitle(title) {
        await this.collection.deleteOne({ title: title });
    }*/
}
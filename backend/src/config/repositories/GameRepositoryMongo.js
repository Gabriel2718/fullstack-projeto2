import dotenv from 'dotenv';
dotenv.config();

import { db } from '../db.js';

export class GameRepositoryMongo {
    static instance = null;

    constructor(collection) {
        if(GameRepositoryMongo.instance) {
            return GameRepositoryMongo.instance
        }
        this.collection = collection;
        GameRepositoryMongo.instance = this;
    }

    static async getInstance() {
        if(!GameRepositoryMongo.instance) {
            const collection = db.collection(process.env.GAME_COLLECTION);

            GameRepositoryMongo.instance = new GameRepositoryMongo(collection);
        }
        return GameRepositoryMongo.instance;
    }

    /*async reloadCache() {
        await this.cacheManager.reloadCache(await this.getAllGames());
    }*/

    async insertGame(game) {
        await this.collection.insertOne(game);
        //this.cacheManager.setGame(game);
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
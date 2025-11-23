import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';

export class GameRepositoryMongo {
    mongoClient;
    collection;
    
    constructor(collection) {
        this.collection = collection;
    }

    static async create() {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();

        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(process.env.GAME_COLLECTION);

        return new GameRepositoryMongo(collection);
    }

    async insertGame(game) {
        await this.collection.insertOne(game);
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
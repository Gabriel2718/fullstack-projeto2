import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';

export class UserRepositoryMongo {
    mongoClient;
    collection;
    
    constructor(collection) {
        this.collection = collection;
    }

    static async create() {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();

        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(process.env.USER_COLLECTION);

        return new UserRepositoryMongo(collection);
    }

    async getUserByName(userName) {
        const res = await this.collection.findOne({ name: userName});
        return res;
    }
}
import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import testData from './testData.json' with { type: 'json' };


const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const db = client.db(process.env.DB_NAME);
const userCollection = db.collection(process.env.USER_COLLECTION);
const gameCollection = db.collection(process.env.GAME_COLLECTION);

const user1 = { 
    name: "user1",
    passwordHash: await bcrypt.hash("senha123", 10)
};

const user2 = { 
    name: "user2",
    passwordHash: await bcrypt.hash("senha456", 10)
};


await userCollection.insertMany([user1, user2]);

await gameCollection.insertMany(testData);
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env'});

import { MongoClient } from 'mongodb';

const client = new MongoClient(
    process.env.MONGODB_URI,
    {
        maxPoolSize: 10,
        minPoolSize: 2
    }
);

await client.connect();

export const db = client.db(process.env.DB_NAME);
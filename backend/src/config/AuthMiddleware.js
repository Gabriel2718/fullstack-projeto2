import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import logger from './Logger.js';

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({ error: "Missing token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        logger.info(`Post attempt from ${decoded.name}`);

        next();
    }catch(error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
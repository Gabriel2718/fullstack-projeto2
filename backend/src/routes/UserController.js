import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { UserRepositoryMongo } from '../config/UserRepositoryMongo.js';
import { UserService } from '../config/UserService.js';
import { User } from '../models/User.js';

const service = new UserService(await UserRepositoryMongo.create());

const route = express.Router();

route.get("/", (req, res) => {
    const { name, password } = req.query; 
    //console.log("Controller REQ: " + {name, passwordHash});
    return service.getUserByName(new User(name, password))
    .then(response => {
        if(response.status != process.env.SUCCESS_MESSAGE) res.status(401);
        res.json(response);
    });
});

export { route };
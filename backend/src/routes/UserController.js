import dotenv from 'dotenv';
dotenv.config();

import validator from 'validator';
import logger from '../config/Logger.js';
import { body } from 'express-validator'
import express from 'express';
import { UserRepositoryMongo } from '../config/repositories/UserRepositoryMongo.js';
import { UserService } from '../config/services/UserService.js';
import { User } from '../models/User.js';


const service = new UserService(await UserRepositoryMongo.create());

const route = express.Router();

route.post("/", [
        body("name")
        .trim()
        .escape(),
        body("password")
        .trim()
    ],(req, res) => {

    logger.info(`Login attempt from ${req.ip}`);

    const { name, password } = req.body; 
    const errors = validateLogin({ name, password });

    if(errors.length > 0) {
        console.log(errors);
        return res.status(400).json({
            status: 'Failed',
            description: 'Empty field(s)',
        });
    }

    return service.getUserByName(new User(name, password))
    .then(response => {
        if(response.status != process.env.SUCCESS_MESSAGE) res.status(401);
        res.json(response);
    });
});

function validateLogin({name, password}) {
    const errors = [];

    if(!name || validator.isEmpty(name.trim())) {
        errors.push("Name field can't be empty")
    } 

    if(!password || validator.isEmpty(password.trim())) {
        errors.push("Password can't be empty")
    }

    return errors
}

export { route };
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    async getUserByName(user) {
        const res = await this.repository.getUserByName(user.name);
        
        //console.log("Service RES: " + res);
        if(res === null) {
            return {
                status: "Failed",
                description: "Non-existent user"
            };
        }

        const correct = await bcrypt.compare(user.password, res.passwordHash);

        if(correct) {
            const token = jwt.sign(
                { id: res._id, name: res.name },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return { 
                status: process.env.SUCCESS_MESSAGE,
                token
             };
        }
        return {
            status: "Failed",
            description: process.env.INCORRECT_PASSWORD_MESSAGE
        };
    }
}
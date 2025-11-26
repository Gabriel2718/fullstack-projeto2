import dotenv from 'dotenv';
dotenv.config();

export class GameService {
    constructor(repository, cacheManager, gamePostValidator) {
        this.repository = repository;
        this.cacheManager = cacheManager;
        this.gamePostValidator = gamePostValidator;
    }

    async getAllGames() {
        return await this.cacheManager.getAllGames();
    }
    
    async getGameByTitle(title) {
        return this.cacheManager.getGameByTitle(title);
    }

    async getPaginatedGames(pageNumber, pageSize = 9) {
        const res = [];
        const games = await this.cacheManager.getAllGames();

        for(let i = 0; i < pageSize; i++) {
            res.push(games[pageSize * pageNumber + 1, (pageSize * pageNumber) + 1 + i]);
        }
        
        if(res[0] === undefined) return [];

        return res.filter(game => game);
    }
    
    async insertGame(game) {
        const validation = await this.gamePostValidator.validateGame(game);

        if(!validation.valid) {
            return {
                valid: false,
                errors: validation.errors
            };
        } 
        await this.repository.insertGame(game);
        return{ valid: true };
    }

    /*async updateByTitle(game) {
        const res = await this.repository.getGameByTitle(game.title);
        if(res.length > 0) {
            await this.repository.updateByTitle(game);
            await this.cacheManager.reloadFromDB();
            return { status: process.env.SUCCESS_MESSAGE }
        }
        return {
            status: "Failed",
            description: "Non-existent game"
        }
        
    }

    async deleteByTitle(title) {
        const res = await this.repository.getGameByTitle(title);
        if(res.length > 0) {
            await this.repository.deleteByTitle(title);
            await this.cacheManager.reloadFromDB();
            return { status: process.env.SUCCESS_MESSAGE }
        }
        return {
            status: "Failed",
            description: "Non-existent game"
        }
    }*/
}
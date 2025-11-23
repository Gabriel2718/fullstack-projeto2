import dotenv from 'dotenv';
dotenv.config();

export class GameService {
    constructor(repository, cacheManager, gamePostValidator) {
        this.repository = repository;
        this.cacheManager = cacheManager;
        this.gamePostValidator = gamePostValidator;
    }
    
    async getAllGames() {
        //return await this.repository.getAllGames();
        return this.cacheManager.getAllGames();
    }
    
    async getGameByTitle(title) {
        //return await this.repository.getGameByTitle(title);
        return this.cacheManager.getGameByTitle(title);
    }

    async getPaginatedGames(pageNumber, pageSize = 9) {
        const res = [];
        const games = this.cacheManager.getAllGames();

        for(let i = 0; i < pageSize; i++) {
            res.push(games[pageSize * pageNumber + 1, (pageSize * pageNumber) + 1 + i]);
        }

        //console.log(res);
        if(res[0] === undefined) return [];

        return res.filter(game => game);
    }
    
    async insertGame(game) {
        /*const res = await this.repository.getGameByTitle(game.title);

        if(res.length == 0) {
            await this.repository.insertGame(game);
            await this.cacheManager.reloadFromDB();
            return { status: process.env.SUCCESS_MESSAGE };
        }*/

        const validation = this.gamePostValidator.validateGame(game);
        if(
            validation.title.status == 'Ok' &&
            validation.imageUrl.status == 'Ok' &&
            validation.normalPrice.status == 'Ok' &&
            validation.salePrice.status == 'Ok' &&
            validation.storeUrl.status == 'Ok'
        ) {
            await this.repository.insertGame(game);
            await this.cacheManager.reloadFromDB();
            return { status: process.env.SUCCESS_MESSAGE };
        }

        return { 
            status: "Falied",
            description: validation
        };
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
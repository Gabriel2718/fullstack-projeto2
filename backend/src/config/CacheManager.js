import { Game } from '../models/Game.js';
import { GameRepositoryMongo } from './GameRepositoryMongo.js';

export class CacheManager {
    static instance = null;

    constructor(repository) {
        if(CacheManager.instance) {
            return CacheManager.instance;
        }
        this.games = [];
        this.repository = repository;
        CacheManager.instance = this;
    }

    static async getInstance() {
        if(!CacheManager.instance) {
            CacheManager.instance = new CacheManager(await GameRepositoryMongo.create());
            await CacheManager.instance.reloadFromDB();
        }
        return CacheManager.instance;
    }

    async reloadFromDB() {
        const res = await this.repository.getAllGames();
        this.games = res.map(game => Game.fromObject(game));
    }

    getAllGames() {
        return this.games;
    }

    getGameByTitle(title) {
        //const main = this.games.filter(game => game.title.toUpperCase() == title.toUpperCase());
        const main = this.games.filter(game => game.title.toUpperCase().includes(title.toUpperCase()));

        const similar = this.games.filter(game => 
            game.title[0].toUpperCase() == title[0].toUpperCase() 
            && game.title[1].toUpperCase() == title[1].toUpperCase() 
            && !game.title.toUpperCase().includes(title.toUpperCase())
        );

        const result = [];

        if(main.length > 0) {
            result.push(...main);
        }

        if(similar.length > 0) {
            result.push(...similar);
        }

        return result;
    }

    getGameByExactTitle(title) {
        const game = this.games.filter(game => game.title.toUpperCase() == title.toUpperCase());
        return game[0];
    }
}
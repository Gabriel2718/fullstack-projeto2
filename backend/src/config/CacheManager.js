import { createClient } from 'redis';
import { GameRepositoryMongo } from './repositories/GameRepositoryMongo';

export class CacheManager {
    static instance = null;

    constructor(repository, redisClient) {
        this.redisClient = redisClient;
        this.repository = repository;
    }

    static async getInstance() {
        if(!CacheManager.instance) {

            const client = createClient();
            client.on("error", err => console.log("Redis Client Error", err));
            await client.connect();

            CacheManager.instance = new CacheManager(
                GameRepositoryMongo.getInstance(),
                client
            );

            await CacheManager.instance.refreshCache(repository);
        }

        return CacheManager.instance;
    }

    async refreshCache(repository) {
        await this.redisClient.flushAll();

        const games = await repository.getAllGames();

        await Promise.all(
            games.map(game => {
                return this.redisClient.set(
                    game.title.toUpperCase().replaceAll(' ', '_').replaceAll(':', ''),
                    JSON.stringify({
                        title: game.title,
                        imageUrl: game.imageUrl,
                        normalPrice: game.normalPrice,
                        salePrice: game.salePrice,
                        storeUrl: game.storeUrl
                    })
                );
            })
        );

        return this;
    }

    async getAllGames() {
        const keys = await this.client.keys('*');
        let games = await Promise.all(
            keys.map(async key => {
                const data = await this.client.get(key);
                return JSON.parse(data);
            })
        );
        
        return games;
    }

    async getGameByTitle(title) {
        const keys = await this.client.keys('*');

        let main = await Promise.all(
            keys.map(async key =>{
                if(key.includes(title
                    .toUpperCase()
                    .replaceAll(' ', '_')
                    .replaceAll(':', '')
                )) {
                    const data = await this.client.get(key)
                    return JSON.parse(data);
                }
            })
        );

        let similar = await Promise.all(
            keys.map(async key => {
                if(key == title[0].toUpperCase()
                    && key == title[1].toUpperCase()
                    && key != title
                    .toUpperCase()
                    .replaceAll(' ', '_')
                    .replaceAll(':', '')
                ) {
                    const data = await this.client.get(key)
                    return JSON.parse(data);
                }
            })
        );

        const result = [];

        if(main.length > 0) {
            result.push(...main);
        }

        if(similar.length > 0) {
            result.push(...similar);
        }

        return result.filter(res => res);
    }

    async setGame(game) {
        await this.client.set(
            game.title
            .toUpperCase()
            .replaceAll(' ', '_')
            .replaceAll(':', ''),
            JSON.stringify({
                title: game.title,
                imageUrl: game.imageUrl,
                normalPrice: game.normalPrice,
                salePrice: game.salePrice,
                storeUrl: game.storeUrl
            })
        );
    }

    async getGameByExactTitle(title) {
        /*const game = this.games.filter(game => game.title.toUpperCase() == title.toUpperCase());
        return game[0];*/

        const game = await this.client.get(title
            .toUpperCase()
            .replaceAll(' ', '_')
            .replaceAll(':', '')
        );

        return game;
    }
}
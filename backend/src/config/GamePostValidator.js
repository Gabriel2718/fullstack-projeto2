import { CacheManager } from './CacheManager.js';

export class GamePostValidator {
    static instance = null;

    constructor(cacheManager) {
        if(GamePostValidator.instance) {
            return GamePostValidator.instance;
        }
        this.cacheManager = cacheManager;
        GamePostValidator.instance = this;
    }

    static async getInstance() {
        if(!GamePostValidator.instance) {
            GamePostValidator.instance = new GamePostValidator(await CacheManager.getInstance());
        }
        return GamePostValidator.instance;
    }

    validateGame(game) {
        return {
            title: this.validateTitle(game.title),
            imageUrl: this.validateImageUrl(game.imageUrl),
            normalPrice: this.validateNormalPrice(game.normalPrice),
            salePrice: this.validateSalePrice(game.salePrice),
            storeUrl: this.validateStoreUrl(game.storeUrl)
        }
    }

    validateTitle(title) {
        let validated = true;
        let problem = '';

        if(title.length == 0) {
            validated = false;
            problem = 'Empty title';
        } else if(this.cacheManager.getGameByExactTitle(title)) {
            validated = false;
            problem = 'Duplicate title';
        }

        if(validated) {
            return {
                status: 'Ok'
            }
        }

       return {
            status: 'Error',
            description: problem
        }
    }

    validateImageUrl(imageUrl) {
        let validated = true;

        if(imageUrl.length == 0) validated = false;

        if(validated) {
            return {
                status: 'Ok'
            }
        }
        
        return {
            status: 'Error',
            description: 'Empty URL'
        }
    }

    validateNormalPrice(normalPrice) {
        let validated = true;
        let problem = '';

        if(!normalPrice) {
            validated = false;
            problem = 'Empty price';
        }else if(isNaN(Number(normalPrice))) {
            validated = false;
            problem = 'Must be a number';
        } else if(Number(normalPrice < 0)) {
            validated = false;
            problem = 'Negative price';
        }

        if(validated) {
            return {
                status: 'Ok'
            }
        }

       return {
            status: 'Error',
            description: problem
        }
    }

    validateSalePrice(salePrice) {
        let validated = true;
        let problem = '';

        if(!salePrice) {
            validated = false;
            problem = 'Empty price';
        }else if(isNaN(Number(salePrice))) {
            validated = false;
            problem = 'Must be a number';
        } else if(Number(salePrice < 0)) {
            validated = false;
            problem = 'Negative price';
        }

        if(validated) {
            return {
                status: 'Ok'
            }
        }

       return {
            status: 'Error',
            description: problem
        }
    }

    validateStoreUrl(storeUrl) {
        let validated = true;

        if(storeUrl.length == 0) validated = false;

        if(validated) {
            return {
                status: 'Ok'
            }
        }
        
        return {
            status: 'Error',
            description: 'Empty URL'
        }
    }   
}
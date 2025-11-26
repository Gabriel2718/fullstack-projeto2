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
            GamePostValidator.instance = new GamePostValidator(
                await CacheManager.getInstance()
            );
        }
        return GamePostValidator.instance;
    }

    async validateGame(game) {
        /*return {
            title: await this.validateTitle(game.title),
            imageUrl: this.validateImageUrl(game.imageUrl),
            normalPrice: this.validateNormalPrice(game.normalPrice),
            salePrice: this.validateSalePrice(game.salePrice),
            storeUrl: this.validateStoreUrl(game.storeUrl)
        }*/

        const errors = [];

        await this.validateTitle(game.title, errors);
        this.validateImageUrl(game.imageUrl, errors);
        this.validateNormalPrice(game.normalPrice, errors);
        this.validateSalePrice(game.salePrice, errors);
        this.validateStoreUrl(game.storeUrl, errors);

        if (errors.length > 0) {
            return {
                valid: false,
                errors
            };
        }

        return { valid: true };
    }

    async validateTitle(title, errors) {
        if (title.length < 3) {
            return errors.push(this.makeError("title", title, "Insufficient characters"));
        }

        if (await this.cacheManager.getGameByExactTitle(title)) {
            return errors.push(this.makeError("title", title, "Duplicate title"));
        }
    }

    validateImageUrl(imageUrl, errors) {
        if (!imageUrl || imageUrl.length === 0) {
            return errors.push(this.makeError("imageUrl", imageUrl, "Empty URL"));
        }
    }

    validateNormalPrice(normalPrice, errors) {
        if (normalPrice === undefined || normalPrice === null || normalPrice === "") {
            return errors.push(this.makeError("normalPrice", normalPrice, "Empty price"));
        }

        if (isNaN(Number(normalPrice))) {
            return errors.push(this.makeError("normalPrice", normalPrice, "Must be a number"));
        }

        if (Number(normalPrice) < 0) {
            return errors.push(this.makeError("normalPrice", normalPrice, "Negative price"));
        }
    }

    validateSalePrice(salePrice, errors) {
        if (salePrice === undefined || salePrice === null || salePrice === "") {
            return errors.push(this.makeError("salePrice", salePrice, "Empty price"));
        }

        if (isNaN(Number(salePrice))) {
            return errors.push(this.makeError("salePrice", salePrice, "Must be a number"));
        }

        if (Number(salePrice) < 0) {
            return errors.push(this.makeError("salePrice", salePrice, "Negative price"));
        }
    }

    validateStoreUrl(storeUrl, errors) {
        if (!storeUrl || storeUrl.length === 0) {
            return errors.push(this.makeError("storeUrl", storeUrl, "Empty URL"));
        }
    }

    makeError(field, value, msg) {
        return {
            type: "field",
            value,
            msg,
            path: field,
            location: "body"
        };
    }

    /*async validateTitle(title) {
        let validated = true;
        let problem = '';

        if(title.length < 3) {
            validated = false;
            problem = 'Insufficient characters';
        } else if(await this.cacheManager.getGameByExactTitle(title)) {
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
} */

}
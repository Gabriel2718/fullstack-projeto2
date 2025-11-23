export class Game {
    constructor(
        title,
        imageUrl,
        normalPrice,
        salePrice,
        storeUrl
    ) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.normalPrice = normalPrice;
        this.salePrice = salePrice;
        this.storeUrl = storeUrl;
    }

    static fromObject(game) {
        return {
            title: game.title,
            imageUrl: game.imageUrl,
            normalPrice: game.normalPrice,
            salePrice: game.salePrice,
            storeUrl: game.storeUrl
        };
    }
}
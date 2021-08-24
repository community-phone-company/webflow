class AddonSection {

    /**
     * @constructor
     * @param {HTMLElement} container 
     */
    constructor(container) {
        this._container = container;
        this._cards = [];
    }

    /**
     * @param {Product[]} products 
     */
    fillWithProducts = (products) => {
        var cards = products.map(product => {
            return new AddonCard()
        });
        this._cards = [];
    }

    /**
     * @param {(productIdentifier: string, isSelected: boolean) => void} handler 
     */
    onAddonStatusChanged = (handler) => {
        this._onAddonStatusChangedHandler = handler;
    }
}
class AddonSection {

    /**
     * @constructor
     * @param {HTMLElement} container 
     */
    constructor(container) {
        this._container = container;
    }

    /**
     * @param {(productIdentifier: string, isSelected: boolean) => void} handler 
     */
    onAddonStatusChanged = (handler) => {
    }
}
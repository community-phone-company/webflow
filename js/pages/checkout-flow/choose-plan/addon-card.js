class AddonCard {

    /**
     * @param {Product} product
     * @returns {string}
     */
    static getIdentifierForCSS = (product) => {
        return `addon-card-${product.id}`;
    }

    /**
     * @param {Product} product
     * @returns {string}
     */
    static getHTML = (product) => {
        return `
            <a
                id=${this.getIdentifierForCSS(product)}
                href="#"
                class="addon-card addons-card-bg w-inline-block"
                community-phone-product-id="${product.id}"
            >
                <div class="w-layout-grid card-addon-handset-phone card-handset">
                    <div style="opacity: 1;" class="div-block-6 addon-card-opacity">
                        <div class="text-block-9">
                            ${product.addonInformation.title}
                        </div>
                        <div class="text-block-10">
                            ${product.addonInformation.subtitle}
                        </div>
                    </div>
                    <img
                        src="https://assets.website-files.com/60c30ab447d78d3beb1f6c82/60d0a444c31f1bc77f528588_img-placeholder.svg"
                        loading="lazy"
                        alt=""
                        class="image-6"
                    >
                    <img
                        src="https://assets.website-files.com/60c30ab447d78d3beb1f6c82/60c73b6e068386753c1fe7da_ic-add.svg"
                        loading="lazy"
                        style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;"
                        alt=""
                        class="image-7 addon-card-add-button"
                    >
                </div>
            </a>
        `;
    }

    /**
     * @constructor
     * @param {HTMLElement} container Container.
     */
    constructor(container) {
        this._container = container;

        $(container).on("click", (event) => {
            event.preventDefault();

            if (this._onCardClickHandler) {
                this._onCardClickHandler(
                    this.getProductIdentifier()
                );
            }
        });
    }

    /**
     * @returns {string}
     */
    getProductIdentifier = () => {
        return $(this._container).attr("community-phone-product-id");
    }

    /**
     * @returns {boolean}
     */
    isSelected = () => {
        return this._isSelected;
    }

    /**
     * @param {boolean} selected 
     */
    setSelected = (selected) => {
        this._isSelected = selected;
        $(this._container).find(".addon-card-opacity").css("opacity", selected ? 0.5 : 1);
        $(this._container).find(".addon-card-add-button").css({
            "transform": `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(${this.isSelected ? "45deg" : "0deg"}) skew(0deg, 0deg)`,
            "transform-style": "preserve-3d"
        });
    }

    /**
     * @param {(productIdentifier: string) => void} handler 
     */
    onCardClick = (handler) => {
        this._onCardClickHandler = handler;
    }
}
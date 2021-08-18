class ProductStore {

    static _default = undefined;

    /**
     * @returns {ProductStore} Instance of {@link ProductStore} type.
     */
    static getDefault = () => {
        if (!this._default) {
            this._default = new ProductStore();
        }

        return this._default;
    }

    constructor() {
        this._products = [];
        this._structure = undefined;
    }

    /**
     * @returns {Product[]}
     */
    getAllProducts = () => {
        return Array.from(
            this._products
        );
    }

    /**
     * @param {string} id Product ID.
     * @returns {Product} Instance of {@link Product} type.
     */
    getProductById = (id) => {
        return this._products.find(product => product.id === id);
    }

    /**
     * Product structure.
     * @returns {ProductStructure} Instance of {@link ProductStructure} type.
     */
    getStructure = () => {
        return this._structure;
    }

    /**
     * Loads list of products from the server.
     * @param {(error: any) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest} `XMLHttpRequest` instance.
     */
    loadProducts = (callback) => {
        const _this = this;
        return $.ajax({
            method: "GET",
            url: `https://staging-landline.phone.community/api/v1/billing/products`,
            dataType: "json",
            data: {
            },
            success: function (response) {
                _this._products = (() => {
                    if (response.products instanceof Array) {
                        return response.products.map(product => {
                            const addonInformation = (() => {
                                if (product.addon_information) {
                                    return new ProductAddonInformation(
                                        product.addon_information.title,
                                        product.addon_information.subtitle
                                    );
                                }

                                return undefined;
                            })();
                            const pricing = (() => {
                                if (product.pricing) {
                                    const subscriptionPrice = (() => {
                                        if (product.pricing.subscription_price) {
                                            return new ProductSubscriptionPrice(
                                                product.pricing.subscription_price.monthly,
                                                product.pricing.subscription_price.annually
                                            );
                                        }

                                        return undefined;
                                    })();
                                    return new ProductPricing(
                                        product.is_subscription,
                                        product.one_time_charge_price,
                                        subscriptionPrice
                                    );
                                }

                                return undefined;
                            })();
                            return new Product(
                                product.id,
                                product.name,
                                product.description_short,
                                product.description_full,
                                product.thumbnail_url,
                                product.is_addon,
                                addonInformation,
                                pricing
                            );
                        });
                    }

                    return [];
                })();
                console.log(`Structure: `, response.structure);
                this._structure = new ProductStructure(response.structure);
                callback(undefined);
            },
            error: function (error) {
                console.log(`Error: `, error);
                callback(error);
            }
        });
    }
}
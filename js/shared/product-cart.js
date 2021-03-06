class ProductCart {

    constructor() {
        this._productIdentifiers = [];
        this.amounts = {
            dueToday: new ProductCartPrice(0, 0, [], 0, 0),
            subscription: new ProductCartPrice(0, 0, [], 0, 0)
        };
        this._billingAddress = undefined;
    }

    /**
     * Billing address.
     * @returns {ProductCartBillingAddress | undefined} Instance of {@link ProductCartBillingAddress} type or `undefined`.
     */
    getBillingAddress = () => {
        return this._billingAddress;
    }

    /**
     * Updates billing address.
     * @param {ProductCartBillingAddress} address Billing address.
     */
    setBillingAddress = (address) => {
        this._billingAddress = address;
    }

    /**
     * Product identifiers.
     * @returns {string[]}
     */
    getProductIdentifiers = () => {
        return Array.from(
            this._productIdentifiers
        );
    }

    /**
     * Adds new product identifier to the list.
     * @param {string} id Product identifier.
     */
    addProductIdentifier = (id) => {
        this._productIdentifiers.push(
            id
        );
    }

    /**
     * Removes product identifier from the list.
     * @param {string} id Product identifier.
     */
    removeProductIdentifier = (id) => {
        if (this._productIdentifiers.includes(id)) {
            const index = this._productIdentifiers.indexOf(id);

            if (index >= 0) {
                this._productIdentifiers.splice(index, 1);
            }
        }
    }

    removeAllProductIdentifiers = () => {
        this._productIdentifiers = [];
    }

    /**
     * Quantity of product.
     * @param {string} id Product identifier.
     * @returns {number} Quantity of product.
     */
    getQuantity = (id) => {
        return this._productIdentifiers.includes(id) ? 1 : 0;
    }

    /**
     * Updates prices.
     * @param {(error) => void} callback Function that is called when result comes from the server.
     * @returns {XMLHttpRequest} `XMLHttpRequest` instance.
     */
    updatePrices = (callback) => {
        const _this = this;
        const data = {
            /**
             * Billing address fields (city, state code, zip and country)
             * should be a non-empty string or `undefined`.
             * Empty string is not acceptable.
             */
            billing_address: {
                city: (() => {
                    const city = _this._billingAddress && _this._billingAddress.city;
                    return (typeof city === "string" && city.length) ? city : undefined;
                })(),
                state_code: (() => {
                    const stateCode = _this._billingAddress && _this._billingAddress.stateCode;
                    return (typeof stateCode === "string" && stateCode.length) ? stateCode : undefined;
                })(),
                zip: (() => {
                    const zip = _this._billingAddress && _this._billingAddress.zip;
                    return (typeof zip === "string" && zip.length) ? zip : undefined;
                })(),
                country: "US"
            },
            products: _this._productIdentifiers.map(productId => {
                return {
                    id: productId,
                    quantity: 1
                };
            })
        };
        console.log(`data: `, data);

        if (this._lastUpdatePricesRequest) {
            this._lastUpdatePricesRequest.abort();
        }

        if (this._onPricesStartedUpdating) {
            this._onPricesStartedUpdating();
        }

        const api = CommunityPhoneAPI.currentEnvironmentWithDefaultVersion();
        const request = api.jsonRequest(
            CommunityPhoneAPI.endpoints.tax_estimate,
            "POST",
            undefined,
            data,
            (response, error) => {
                if (error) {
                    _this.amounts.dueToday = undefined;
                    _this.amounts.subscription = undefined;

                    if (callback) {
                        callback(error);
                    }

                    if (_this._onPricesUpdatedHandler) {
                        _this._onPricesUpdatedHandler(
                            error
                        );
                    }
                } else {
                    _this.amounts.dueToday = ProductCartPrice.fromJson(
                        response.price.due_today
                    );
                    _this.amounts.subscription = ProductCartPrice.fromJson(
                        response.price.subscription
                    );

                    if (callback) {
                        callback(undefined);
                    }

                    if (_this._onPricesUpdatedHandler) {
                        _this._onPricesUpdatedHandler(
                            undefined
                        );
                    }
                }
            }
        );
        this._lastUpdatePricesRequest = request;
        return request;
    }

    /**
     * @param {() => void} handler Function that is called every time when the product cart prices list has started updating.
     */
    onPricesStartedUpdating = (handler) => {
        this._onPricesStartedUpdating = handler;
    }

    /**
     * @param {(error: any | undefined) => void} handler Function that is called every time when the product cart prices list is updated.
     */
    onPricesUpdated = (handler) => {
        this._onPricesUpdatedHandler = handler;
    }
}

class ProductCartBillingAddress {

    /**
     * @constructor
     * @param {string} city City name.
     * @param {string} stateCode State code.
     * @param {string} zip Zip code.
     */
    constructor(
        city,
        stateCode,
        zip
    ) {
        this.city = city;
        this.stateCode = stateCode;
        this.zip = zip;
    }

    /**
     * @param {ProductCartBillingAddress} address 
     * @returns {boolean}
     */
    equalsTo = (address) => {
        return this.city === address.city
            && this.stateCode === address.stateCode
            && this.zip === address.zip;
    }
}

class ProductCartPrice {

    /**
     * @param {any} json 
     * @returns {ProductCartPrice}
     */
    static fromJson = (json) => {
        return new ProductCartPrice(
            json.subtotal ?? 0,
            json.taxes ?? 0,
            (json.tax_breakdown ?? []).map(element => ProductCartPriceTaxBreakdownItem.fromJson(element)),
            json.total ?? 0,
            json.amount_due ?? 0
        );
    }

    /**
     * @constructor
     * @param {number} subtotal 
     * @param {number} taxes 
     * @param {ProductCartPriceTaxBreakdownItem[]} taxBreakdown
     * @param {number} total 
     * @param {number} amountDue 
     */
    constructor(
        subtotal,
        taxes,
        taxBreakdown,
        total,
        amountDue
    ) {
        this.subtotal = subtotal;
        this.taxes = taxes;
        this.taxBreakdown = taxBreakdown;
        this.total = total;
        this.amountDue = amountDue;
    }
}

class ProductCartPriceTaxBreakdownItem {

    static fromJson = (json) => {
        return new ProductCartPriceTaxBreakdownItem(
            json.name,
            json.amount
        );
    }

    /**
     * @constructor
     * @param {string} name 
     * @param {number} amount 
     */
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
    }
}
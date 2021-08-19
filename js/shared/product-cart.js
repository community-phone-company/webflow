class ProductCart {

    constructor() {
        this._productIdentifiers = [];
        this.amounts = {
            dueToday: new ProductCartPrice(0, 0, 0, 0),
            subscription: new ProductCartPrice(0, 0, 0, 0)
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

    /**
     * Updates prices.
     * @param {(error) => void} callback Function that is called when result comes from the server.
     * @returns {XMLHttpRequest} `XMLHttpRequest` instance.
     */
    updatePrices = (callback) => {
        const _this = this;
        const data = {
            billing_address: {
                city: _this._billingAddress && _this._billingAddress.city,
                state_code: _this._billingAddress && _this._billingAddress.stateCode,
                zip: _this._billingAddress && _this._billingAddress.zip,
                country: "US"
            },
            products: _this._productIdentifiers.map(productId => {
                return {
                    id: productId,
                    quantity: 1
                };
            })
        };
        return $.ajax({
            url: `https://staging-landline.phone.community/api/v1/billing/products/tax-estimate`,
            method: "POST",
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                _this.amounts.dueToday = ProductCartPrice.fromJson(
                    response.due_today
                );
                _this.amounts.subscription = ProductCartPrice.fromJson(
                    response.subscription
                );
                callback(undefined);
            },
            error: function (error) {
                console.log(`Error: `, error);
                callback(error);
            }
        });
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
}

class ProductCartPrice {

    /**
     * @param {any} json 
     * @returns {ProductCartPrice}
     */
    static fromJson = (json) => {
        console.log(`fromJSON: `, json);
        return new ProductCartPrice(
            json.subtotal ?? 0,
            json.taxes ?? 0,
            json.total ?? 0,
            json.amount_due ?? 0
        );
    }

    /**
     * @constructor
     * @param {number} subtotal 
     * @param {number} taxes 
     * @param {number} total 
     * @param {number} amountDue 
     */
    constructor(
        subtotal,
        taxes,
        total,
        amountDue
    ) {
        this.subtotal = subtotal;
        this.taxes = taxes;
        this.total = total;
        this.amountDue = amountDue;
    }
}
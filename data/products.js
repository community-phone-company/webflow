class ProductStore {

    constructor() {
        this.products = [
            new Product(
                ProductIdentifier.landlineBase,
                false,
                99
            ),
            new Product(
                ProductIdentifier.landlinePhoneServiceMonthly,
                true,
                29
            ),
            new Product(
                ProductIdentifier.landlinePhoneServiceYearly,
                true,
                264
            ),
            new Product(
                ProductIdentifier.portingLandlineNumberMonthly,
                true,
                39
            ),
            new Product(
                ProductIdentifier.portingLandlineNumberYearly,
                true,
                384
            ),
            new Product(
                ProductIdentifier.insuranceMonthly,
                true,
                5
            ),
            new Product(
                ProductIdentifier.insuranceYearly,
                true,
                50
            ),
            new Product(
                ProductIdentifier.handset,
                false,
                39
            )
        ];
    }

    /**
     * @param {string} id Product identifier.
     * @returns {Product | undefined} Instance of {@link Product} type of `undefined`.
     */
    getProductById = (id) => {
        return this.products.find(product => product.id === id);
    }
}
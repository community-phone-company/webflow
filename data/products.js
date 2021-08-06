class ProductStore {

    constructor() {
        this.products = [
            new Product(
                ProductIdentifier.landlineBase,
                false,
                PRODUCT_PRICE.LANDLINE_BASE
            ),
            new Product(
                ProductIdentifier.landlinePhoneServiceMonthly,
                true,
                PRODUCT_PRICE.NEW_NUMBER_MONTHLY
            ),
            new Product(
                ProductIdentifier.landlinePhoneServiceYearly,
                true,
                PRODUCT_PRICE.NEW_NUMBER_YEARLY
            ),
            new Product(
                ProductIdentifier.portingLandlineNumberMonthly,
                true,
                PRODUCT_PRICE.KEEP_NUMBER_MONTHLY
            ),
            new Product(
                ProductIdentifier.portingLandlineNumberYearly,
                true,
                PRODUCT_PRICE.KEEP_NUMBER_YEARLY
            ),
            new Product(
                ProductIdentifier.insuranceMonthly,
                true,
                PRODUCT_PRICE.INSURANCE_MONTHLY
            ),
            new Product(
                ProductIdentifier.insuranceYearly,
                true,
                PRODUCT_PRICE.INSURANCE_YEARLY
            ),
            new Product(
                ProductIdentifier.handset,
                false,
                PRODUCT_PRICE.HANDSET
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
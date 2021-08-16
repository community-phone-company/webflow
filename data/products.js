class StaticProductStore {

    constructor() {
        this.products = [
            new OrderProduct(
                ProductIdentifier.landlineBase,
                false,
                PRODUCT_PRICE.LANDLINE_BASE
            ),
            new OrderProduct(
                ProductIdentifier.landlinePhoneServiceMonthly,
                true,
                PRODUCT_PRICE.NEW_NUMBER_MONTHLY
            ),
            new OrderProduct(
                ProductIdentifier.landlinePhoneServiceYearly,
                true,
                PRODUCT_PRICE.NEW_NUMBER_YEARLY
            ),
            new OrderProduct(
                ProductIdentifier.portingLandlineNumberMonthly,
                true,
                PRODUCT_PRICE.KEEP_NUMBER_MONTHLY
            ),
            new OrderProduct(
                ProductIdentifier.portingLandlineNumberYearly,
                true,
                PRODUCT_PRICE.KEEP_NUMBER_YEARLY
            ),
            new OrderProduct(
                ProductIdentifier.insuranceMonthly,
                true,
                PRODUCT_PRICE.INSURANCE_MONTHLY
            ),
            new OrderProduct(
                ProductIdentifier.insuranceYearly,
                true,
                PRODUCT_PRICE.INSURANCE_YEARLY
            ),
            new OrderProduct(
                ProductIdentifier.handset,
                false,
                PRODUCT_PRICE.HANDSET
            )
        ];
    }

    /**
     * @param {string} id Product identifier.
     * @returns {OrderProduct | undefined} Instance of {@link OrderProduct} type of `undefined`.
     */
    getProductById = (id) => {
        return this.products.find(product => product.id === id);
    }
}
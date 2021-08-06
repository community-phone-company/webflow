/**
 * Edit prices here.
 */
const PRODUCT_STORE_PRICES = Object.freeze({
    LANDLINE_BASE: 99,
    NEW_NUMBER_MONTHLY: 29,
    NEW_NUMBER_YEARLY: 264,
    KEEP_NUMBER_MONTHLY: 39,
    KEEP_NUMBER_YEARLY: 384,
    INSURANCE_MONTHLY: 5,
    INSURANCE_YEARLY: 50,
    HANDSET: 39
});

class ProductStore {

    constructor() {
        this.products = [
            new Product(
                ProductIdentifier.landlineBase,
                false,
                PRODUCT_STORE_PRICES.LANDLINE_BASE
            ),
            new Product(
                ProductIdentifier.landlinePhoneServiceMonthly,
                true,
                PRODUCT_STORE_PRICES.NEW_NUMBER_MONTHLY
            ),
            new Product(
                ProductIdentifier.landlinePhoneServiceYearly,
                true,
                PRODUCT_STORE_PRICES.NEW_NUMBER_YEARLY
            ),
            new Product(
                ProductIdentifier.portingLandlineNumberMonthly,
                true,
                PRODUCT_STORE_PRICES.KEEP_NUMBER_MONTHLY
            ),
            new Product(
                ProductIdentifier.portingLandlineNumberYearly,
                true,
                PRODUCT_STORE_PRICES.KEEP_NUMBER_YEARLY
            ),
            new Product(
                ProductIdentifier.insuranceMonthly,
                true,
                PRODUCT_STORE_PRICES.INSURANCE_MONTHLY
            ),
            new Product(
                ProductIdentifier.insuranceYearly,
                true,
                PRODUCT_STORE_PRICES.INSURANCE_YEARLY
            ),
            new Product(
                ProductIdentifier.handset,
                false,
                PRODUCT_STORE_PRICES.HANDSET
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
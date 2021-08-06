const ProductIdentifier = Object.freeze({
    landlineBase: "landline-base",
    landlinePhoneServiceMonthly: "landline-phone-service-monthly",
    landlinePhoneServiceYearly: "landline-phone-service-annually",
    portingLandlineNumberMonthly: "porting-landline-number-monthly",
    portingLandlineNumberYearly: "porting-landline-number-annually",
    insuranceMonthly: "insurance-",
    insuranceYearly: "insurance-yearly",
    handset: "landline-handset"
});

class Product {

    /**
     * 
     * @param {string} id Product identifier.
     * @param {boolean} isSubscription Defines whether the product is a subscription.
     * @param {number} price Price.
     */
    constructor(id, isSubscription, price) {
        this.id = id;
        this.isSubscription = isSubscription;
        this.price = price;
    }
}
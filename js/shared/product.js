class Product {

    /**
     * @constructor
     * @param {string} id Identifier.
     * @param {string} name Name.
     * @param {string} descriptionShort Shortened description.
     * @param {string} descriptionFull Full description.
     * @param {string} thumbnailUrl Thumbnail URL.
     * @param {boolean} isAddon Defines whether the product is addon.
     * @param {ProductAddonInformation} addonInformation Addon information.
     * @param {ProductPricing} pricing Pricing.
     */
    constructor(
        id,
        name,
        descriptionShort,
        descriptionFull,
        thumbnailUrl,
        isAddon,
        addonInformation,
        pricing
    ) {
        this.id = id;
        this.name = name;
        this.descriptionShort = descriptionShort;
        this.descriptionFull = descriptionFull;
        this.thumbnailUrl = thumbnailUrl;
        this.isAddon = isAddon;
        this.addonInformation = addonInformation;
        this.pricing = pricing;
    }
}

new Product()

class ProductAddonInformation {

    /**
     * @constructor
     * @param {string} title Title.
     * @param {string} subtitle Subtitle.
     */
    constructor(
        title,
        subtitle
    ) {
        this.title = title;
        this.subtitle = subtitle;
    }
}

class ProductPricing {

    /**
     * @constructor
     * @param {boolean} isSubscription Defines whether the product is subscription.
     * @param {number} oneTimeChargePrice One time charge price.
     * @param {ProductSubscriptionPrice} subscriptionPrice Subscription price.
     */
    constructor(
        isSubscription,
        oneTimeChargePrice,
        subscriptionPrice
    ) {
        this.isSubscription = isSubscription;
        this.oneTimeChargePrice = oneTimeChargePrice;
        this.subscriptionPrice = subscriptionPrice;
    }

    /**
     * @returns {number}
     */
    getPrice = () => {
        return this.isSubscription
            ? this.subscriptionPrice.monthly ?? this.subscriptionPrice.annually
            : this.oneTimeChargePrice;
    }
}

class ProductSubscriptionPrice {

    /**
     * @constructor
     * @param {number} monthly Monthly subscription price.
     * @param {number} annually Annually subscription price.
     */
    constructor(
        monthly,
        annually
    ) {
        this.monthly = monthly;
        this.annually = annually;
    }
}

class ProductStructure {

    /**
     * @constructor
     * @param {any} json 
     */
    constructor(json) {
        this.landlineBaseProductId = json.landline_base_product_id;
        this.plans = {
            newNumber: {
                monthlyPlanId: json.plans.new_number.monthly_plan_id,
                yearlyPlanId: json.plans.new_number.yearly_plan_id
            },
            keepNumber: {
                monthlyPlanId: json.plans.keep_my_number.monthly_plan_id,
                yearlyPlanId: json.plans.keep_my_number.yearly_plan_id
            }
        };
        this.addons = json.addons;
    }
}
/**
 * Updates visibility of product cards in the order summary column.
 * @param {string[]} productIdentifiers Product identifiers.
 */
const updateOrderSummaryColumn = (productIdentifiers) => {
    const useNewImplementation = router.isTestEnvironment();

    if (useNewImplementation) {
        console.log("Use new implementation");
    } else {
        console.log("Use old implementation");
        const cards = {
            landlineBase: document.getElementById("order-summary-product-landline-base"),
            newNumberMonthly: document.getElementById("order-summary-product-new-number-monthly"),
            newNumberYearly: document.getElementById("order-summary-product-new-number-yearly"),
            keepNumberMonthly: document.getElementById("order-summary-product-keep-number-monthly"),
            keepNumberYearly: document.getElementById("order-summary-product-keep-number-yearly"),
            handset: document.getElementById("order-summary-product-handset"),
            insuranceMonthly: document.getElementById("order-summary-product-insurance-monthly"),
            insuranceYearly: document.getElementById("order-summary-product-insurance-yearly")
        };
    
        const hasProduct = (id) => {
            return productIdentifiers.includes(id);
        }
        
        hasProduct(ProductIdentifier.landlineBase)
            ? $(cards.landlineBase).show()
            : $(cards.landlineBase).hide();
    
        hasProduct(ProductIdentifier.portingLandlineNumberMonthly)
            ? $(cards.keepNumberMonthly).show()
            : $(cards.keepNumberMonthly).hide();
        
        hasProduct(ProductIdentifier.portingLandlineNumberYearly)
            ? $(cards.keepNumberYearly).show()
            : $(cards.keepNumberYearly).hide();
        
        hasProduct(ProductIdentifier.landlinePhoneServiceMonthly)
            ? $(cards.newNumberMonthly).show()
            : $(cards.newNumberMonthly).hide();
    
        hasProduct(ProductIdentifier.landlinePhoneServiceYearly)
            ? $(cards.newNumberYearly).show()
            : $(cards.newNumberYearly).hide();
        
        hasProduct(ProductIdentifier.handset)
            ? $(cards.handset).show()
            : $(cards.handset).hide();
        
        hasProduct(ProductIdentifier.insuranceMonthly)
            ? $(cards.insuranceMonthly).show()
            : $(cards.insuranceMonthly).hide();
        
        hasProduct(ProductIdentifier.insuranceYearly)
            ? $(cards.insuranceYearly).show()
            : $(cards.insuranceYearly).hide();
        
        const productStore = new StaticProductStore();
        const products = productIdentifiers.map(id => productStore.getProductById(id));
        
        logger.print(productIdentifiers);
        
        const oneTimeChargePrice = products
            .filter(product => !product.isSubscription)
            .map(product => product.price)
            .reduce((left, right) => left + right);
        const subscriptionPrice = products
            .filter(product => product.isSubscription)
            .map(product => product.price)
            .reduce((left, right) => left + right);
        
        $(".device-price-with-handset").remove();
        $(".device-price-without-handset").html(`$${oneTimeChargePrice}`);
        $(".service-price-new-number-y").remove();
        $(".service-price-porting-m").remove();
        $(".service-price-porting-y").remove();
        $(".cost-plus-insurance").remove();
        $(".insurance-item").remove();
        $(".service-price-new-number-m").html(`$${subscriptionPrice}`);
    }
};
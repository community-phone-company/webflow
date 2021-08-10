/**
 * Updates visibility of product cards in the order summary column.
 * @param {string[]} productIdentifiers Product identifiers.
 */
const updateOrderSummaryColumn = (productIdentifiers) => {
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
    
    const productStore = new ProductStore();
    const products = productIdentifiers.map(id => productStore.getProductById(id));
    
    logger.print(productIdentifiers);
    
    const oneTimeChargePrice = products
        .filter(product => !product.isSubscription)
        .map(product => product.price)
        .reduce((left, right) => left + right);
    $(".price-total-due-today").html(`$${oneTimeChargePrice}`);

    const subscriptionPrice = products
        .filter(product => product.isSubscription)
        .map(product => product.price)
        .reduce((left, right) => left + right);
    $(".price-service-total").html(`$${subscriptionPrice}`);
};
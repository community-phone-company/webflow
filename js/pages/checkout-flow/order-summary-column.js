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
    
    hasProduct(ProductIdentifier.landlinePhoneServiceMonthly) && !hasProduct(ProductIdentifier.portingLandlineNumberMonthly)
        ? $(cards.newNumberMonthly).show()
        : $(cards.newNumberMonthly).hide();

    hasProduct(ProductIdentifier.landlinePhoneServiceYearly) && !hasProduct(ProductIdentifier.portingLandlineNumberYearly)
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
};
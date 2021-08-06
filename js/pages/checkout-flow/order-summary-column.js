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
    
    productIdentifiers.includes(ProductIdentifier.landlineBase)
        ? $(cards.landlineBase).show()
        : $(cards.landlineBase).hide();

    productIdentifiers.includes(ProductIdentifier.landlinePhoneServiceMonthly)
        ? $(cards.newNumberMonthly).show()
        : $(cards.newNumberMonthly).hide();

    productIdentifiers.includes(ProductIdentifier.landlinePhoneServiceYearly)
        ? $(cards.newNumberYearly).show()
        : $(cards.newNumberYearly).hide();
    
    productIdentifiers.includes(ProductIdentifier.portingLandlineNumberMonthly)
        ? $(cards.keepNumberMonthly).show()
        : $(cards.keepNumberMonthly).hide();
    
    productIdentifiers.includes(ProductIdentifier.portingLandlineNumberYearly)
        ? $(cards.keepNumberYearly).show()
        : $(cards.keepNumberYearly).hide();
    
    productIdentifiers.includes(ProductIdentifier.handset)
        ? $(cards.handset).show()
        : $(cards.handset).hide();
    
    productIdentifiers.includes(ProductIdentifier.insuranceMonthly)
        ? $(cards.insuranceMonthly).show()
        : $(cards.insuranceMonthly).hide();
    
    productIdentifiers.includes(ProductIdentifier.insuranceYearly)
        ? $(cards.insuranceYearly).show()
        : $(cards.insuranceYearly).hide();
};
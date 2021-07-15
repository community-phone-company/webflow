const CheckoutFlowStoreKey = Object.freeze({
    getNewNumber: "checkout-flow-get-new-number",
    period: "checkout-flow-period",
    addHandsetPhone: "checkout-flow-add-handset-phone",
    addInsurance: "checkout-flow-add-insurance",
    firstName: "checkout-flow-first-name",
    lastName: "checkout-flow-last-name",
    phone: "checkout-flow-phone",
    email: "checkout-flow-email",
    shippingAddress_firstName: "checkout-flow-shipping-address-first-name",
    shippingAddress_lastName: "checkout-flow-shipping-address-last-name",
    shippingAddress_addressLine1: "checkout-flow-shipping-address-address-line-1",
    shippingAddress_addressLine2: "checkout-flow-shipping-address-address-line-2",
    shippingAddress_city: "checkout-flow-shipping-address-city",
    shippingAddress_zip: "checkout-flow-shipping-address-zip",
    shippingAddress_state: "checkout-flow-shipping-address-state",
    billingAddress_firstName: "checkout-flow-billing-address-first-name",
    billingAddress_lastName: "checkout-flow-billing-address-last-name",
    billingAddress_addressLine1: "checkout-flow-billing-address-address-line-1",
    billingAddress_addressLine2: "checkout-flow-billing-address-address-line-2",
    billingAddress_city: "checkout-flow-billing-address-city",
    billingAddress_zip: "checkout-flow-billing-address-zip",
    billingAddress_state: "checkout-flow-billing-address-state",
});

const exportCheckoutFlowDataToActiveCampaign = (callback) => {
    ActiveCampaignIntegration.createOrUpdateContact(
        new ActiveCampaignContact(
            Store.local.read(CheckoutFlowStoreKey.email),
            Store.local.read(CheckoutFlowStoreKey.firstName),
            Store.local.read(CheckoutFlowStoreKey.lastName),
            Store.local.read(CheckoutFlowStoreKey.phone),
            [
                new ActiveCampaignContactCustomField(
                    "Get a new number",
                    Store.local.read(CheckoutFlowStoreKey.getNewNumber)
                ),
                new ActiveCampaignContactCustomField(
                    "Period",
                    Store.local.read(CheckoutFlowStoreKey.period)
                ),
                new ActiveCampaignContactCustomField(
                    "Add a handset / phone",
                    Store.local.read(CheckoutFlowStoreKey.addHandsetPhone)
                ),
                new ActiveCampaignContactCustomField(
                    "Add insurance",
                    Store.local.read(CheckoutFlowStoreKey.addInsurance)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address first name",
                    Store.local.read(CheckoutFlowStoreKey.shippingAddress_firstName)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address last name",
                    Store.local.read(CheckoutFlowStoreKey.shippingAddress_lastName)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address address line 1",
                    Store.local.read(CheckoutFlowStoreKey.shippingAddress_addressLine1)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address address line 2",
                    Store.local.read(CheckoutFlowStoreKey.shippingAddress_addressLine2)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address city",
                    Store.local.read(CheckoutFlowStoreKey.shippingAddress_city)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address zip",
                    Store.local.read(CheckoutFlowStoreKey.shippingAddress_zip)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address state",
                    Store.local.read(CheckoutFlowStoreKey.shippingAddress_state)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address first name",
                    Store.local.read(CheckoutFlowStoreKey.billingAddress_firstName)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address last name",
                    Store.local.read(CheckoutFlowStoreKey.billingAddress_lastName)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address address line 1",
                    Store.local.read(CheckoutFlowStoreKey.billingAddress_addressLine1)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address address line 2",
                    Store.local.read(CheckoutFlowStoreKey.billingAddress_addressLine2)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address city",
                    Store.local.read(CheckoutFlowStoreKey.billingAddress_city)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address zip",
                    Store.local.read(CheckoutFlowStoreKey.billingAddress_zip)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address state",
                    Store.local.read(CheckoutFlowStoreKey.billingAddress_state)
                ),
            ]
        ),
        (response, error, success) => {
            if (callback) {
                callback();
            }
        }
    );
};
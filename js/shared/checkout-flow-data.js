/**
 * Exports data stored in the local storage to Active Campaign.
 * @param {(response: any, error: any, success: boolean) => void} callback Function that is called when request to Active Campaign API is finished.
 * @returns {XMLHttpRequest} Request instance.
 */
const exportCheckoutFlowDataToActiveCampaign = (callback) => {
    return ActiveCampaignIntegration.createOrUpdateContact(
        new ActiveCampaignContact(
            Store.local.read(Store.keys.checkoutFlow.email),
            Store.local.read(Store.keys.checkoutFlow.firstName),
            Store.local.read(Store.keys.checkoutFlow.lastName),
            Store.local.read(Store.keys.checkoutFlow.phone),
            [
                new ActiveCampaignContactCustomField(
                    "From checkout flow",
                    "Yes"
                ),
                new ActiveCampaignContactCustomField(
                    "Get a new number",
                    Store.local.read(Store.keys.checkoutFlow.getNewNumber) ? "Yes": "No"
                ),
                new ActiveCampaignContactCustomField(
                    "Period",
                    Store.local.read(Store.keys.checkoutFlow.period)
                ),
                new ActiveCampaignContactCustomField(
                    "Add a handset / phone",
                    Store.local.read(Store.keys.checkoutFlow.addHandsetPhone) ? "Yes": "No"
                ),
                new ActiveCampaignContactCustomField(
                    "Add insurance",
                    Store.local.read(Store.keys.checkoutFlow.addInsurance) ? "Yes": "No"
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address first name",
                    Store.local.read(Store.keys.checkoutFlow.shippingAddress_firstName)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address last name",
                    Store.local.read(Store.keys.checkoutFlow.shippingAddress_lastName)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address address line 1",
                    Store.local.read(Store.keys.checkoutFlow.shippingAddress_addressLine1)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address address line 2",
                    Store.local.read(Store.keys.checkoutFlow.shippingAddress_addressLine2)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address city",
                    Store.local.read(Store.keys.checkoutFlow.shippingAddress_city)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address zip",
                    Store.local.read(Store.keys.checkoutFlow.shippingAddress_zip)
                ),
                new ActiveCampaignContactCustomField(
                    "Shipping address state",
                    Store.local.read(Store.keys.checkoutFlow.shippingAddress_state)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address first name",
                    Store.local.read(Store.keys.checkoutFlow.billingAddress_firstName)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address last name",
                    Store.local.read(Store.keys.checkoutFlow.billingAddress_lastName)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address address line 1",
                    Store.local.read(Store.keys.checkoutFlow.billingAddress_addressLine1)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address address line 2",
                    Store.local.read(Store.keys.checkoutFlow.billingAddress_addressLine2)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address city",
                    Store.local.read(Store.keys.checkoutFlow.billingAddress_city)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address zip",
                    Store.local.read(Store.keys.checkoutFlow.billingAddress_zip)
                ),
                new ActiveCampaignContactCustomField(
                    "Billing address state",
                    Store.local.read(Store.keys.checkoutFlow.billingAddress_state)
                ),
                (() => {
                    const session = CheckoutSession.getCurrent();
                    new ActiveCampaignContactCustomField(
                        "Abandon cart link",
                        session.isAuthorized()
                            ? CheckoutSession.generateAbandonedCartLink(session.getId())
                            : ""
                    )
                })()
            ]
        ),
        ActiveCampaignList.chargebeeAbandonedCarts(),
        (response, error, success) => {
            if (callback) {
                callback();
            }
        }
    );
};
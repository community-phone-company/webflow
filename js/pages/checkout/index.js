/**
 * 
 * @param {string} id Text field id.
 * @param {string} apiKey Google Places API key.
 */
const initializeAddressLine = (id, apiKey) => {
};

const exportEmailToHotjar = () => {
    const email = Store.local.read(CheckoutFlowStoreKey.email);
    
    if (email) {
        console.log("Hotjar");
        HotjarIntegration.send({
            "Email": email
        });
    }
};

const exportCheckoutFlowDataFromAccountStepToActiveCampaign = () => {
    const firstName = Store.local.read(CheckoutFlowStoreKey.firstName);
    const lastName = Store.local.read(CheckoutFlowStoreKey.lastName);
    const phone = Store.local.read(CheckoutFlowStoreKey.phone);
    const email = Store.local.read(CheckoutFlowStoreKey.email);

    console.log("Active Campaign");
    ActiveCampaignIntegration.createOrUpdateContact(
        new ActiveCampaignContact(
            email,
            firstName,
            lastName,
            phone,
            []
        )
    );
};

$(document).ready(() => {
    /*
     * Address line 1.
     */
    const addressLineOneInput = document.getElementById("Adress-line");
    
    if (addressLineOneInput instanceof HTMLInputElement) {
        addressLineOneInput.oninput = () => {
            const address = addressLineOneInput.value;
            console.log(`Address: ${address}`);
        };
    }

    exportEmailToHotjar();
    exportCheckoutFlowDataFromAccountStepToActiveCampaign();
});
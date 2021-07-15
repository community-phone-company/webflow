/**
 * 
 * @param {string} id Text field id.
 * @param {string} apiKey Google Places API key.
 */
const initializeAddressLine = (id, apiKey) => {
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
    
    exportCheckoutFlowDataToActiveCampaign(
        (response, error, success) => {
            console.log("Active Campaign");
        }
    );
});
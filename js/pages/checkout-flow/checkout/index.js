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

    /**
     * Here we handle submit button click.
     */
     const submitButton = document.querySelectorAll(".buy_now_checkout")[0];

     $(submitButton).on("click", (event) => {
         const shippingAddress_firstName = $("#First-name").val();
         Store.local.write(CheckoutFlowStoreKey.shippingAddress_firstName, shippingAddress_firstName);

         const shippingAddress_firstName = $("#Last-name").val();
         Store.local.write(CheckoutFlowStoreKey.shippingAddress_lastName, shippingAddress_lastName);
 
         const shippingAddress_addressLine1 = $("#Adress-line").val();
         Store.local.write(CheckoutFlowStoreKey.shippingAddress_addressLine1, shippingAddress_addressLine1);

         const shippingAddress_addressLine2 = $("#Adress-line-2").val();
         Store.local.write(CheckoutFlowStoreKey.shippingAddress_addressLine2, shippingAddress_addressLine2);

         const shippingAddress_city = $("#City").val();
         Store.local.write(CheckoutFlowStoreKey.shippingAddress_city, shippingAddress_city);

         const shippingAddress_zip = $("#Zip").val();
         Store.local.write(CheckoutFlowStoreKey.shippingAddress_zip, shippingAddress_zip);

         const shippingAddress_state = $("#State").val();
         Store.local.write(CheckoutFlowStoreKey.shippingAddress_state, shippingAddress_state);

         const useDifferentShippingAddress = $(".billing-fields").css("display") === "block";
     });
    
    /**
     * Send user's data to Active Campaign.
     */
    exportCheckoutFlowDataToActiveCampaign(
        (response, error, success) => {
            console.log("Active Campaign");
        }
    );
});
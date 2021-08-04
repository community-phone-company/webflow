/**
 * 
 * @param {string} id Text field id.
 * @param {string} apiKey Google Places API key.
 */
const initializeAddressLine = (id, apiKey) => {
};

var clipboard = new ClipboardJS('.btn');

$(document).ready(() => {
    /*
     * Address line 1.
     */
    const addressLineOneInput = document.getElementById("Adress-line");
    
    if ($(addressLineOneInput).hasClass("gpa-input")) {
        var autocomplete = new google.maps.places.Autocomplete(gpaInput);
    }
    
    if (addressLineOneInput instanceof HTMLInputElement) {
        addressLineOneInput.oninput = () => {
            const address = addressLineOneInput.value;
            logger.print(`Address: ${address}`);
        };
    }

    /**
     * Here we handle submit button click.
     */
     const submitButton = document.querySelectorAll(".buy_now_checkout")[0];

     $(submitButton).on("click", (event) => {
         const shippingAddress_firstName = $("#First-name").val();
         Store.local.write(Store.keys.checkoutFlow.shippingAddress_firstName, shippingAddress_firstName);

         const shippingAddress_lastName = $("#Last-name").val();
         Store.local.write(Store.keys.checkoutFlow.shippingAddress_lastName, shippingAddress_lastName);
 
         const shippingAddress_addressLine1 = $("#Adress-line").val();
         Store.local.write(Store.keys.checkoutFlow.shippingAddress_addressLine1, shippingAddress_addressLine1);

         const shippingAddress_addressLine2 = $("#Adress-line-2").val();
         Store.local.write(Store.keys.checkoutFlow.shippingAddress_addressLine2, shippingAddress_addressLine2);

         const shippingAddress_city = $("#City").val();
         Store.local.write(Store.keys.checkoutFlow.shippingAddress_city, shippingAddress_city);

         const shippingAddress_zip = $("#Zip").val();
         Store.local.write(Store.keys.checkoutFlow.shippingAddress_zip, shippingAddress_zip);

         const shippingAddress_state = $("#State").val();
         Store.local.write(Store.keys.checkoutFlow.shippingAddress_state, shippingAddress_state);

         const useDifferentShippingAddress = $(".billing-fields").css("display") === "block";
     });
    
    /**
     * Send user's data to Active Campaign.
     */
    exportCheckoutFlowDataToActiveCampaign(
        (response, error, success) => {
            logger.print("Active Campaign");
        }
    );
});
$(document).ready(() => {

    (() => {
        const submitButton = document.querySelectorAll(".dummyCheckBtn")[0];
        
        if (!submitButton) {
            return;
        }

        $(submitButton).on("click", () => {
            logger.print("Clicked the submit button")
            
            const address = $("div.custom_address input").val();
            const city = $("div.custom_city_state input.custom_ctiy").val();
            const state = $("div.custom_city_state input.custom_state").val();
            const zip = $("input#zipcode-2").val();
            const isBusiness = $("input#businessCheck")[0].checked;

            logger.print("Collected the data");
            logger.print("Sending to GoogleDocIntegration.addLineToServiceAddressCheck()");
            
            GoogleDocIntegration.addLineToServiceAddressCheck(
                address,
                city,
                state,
                zip,
                isBusiness
            );
        });
    })();
});
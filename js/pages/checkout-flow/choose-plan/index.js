$(document).ready(() => {

    /**
     * Here we handle submit button click.
     */
    const submitButton = document.querySelectorAll(".continue_choose_plan")[0];

    $(submitButton).on("click", (event) => {
        const getNewNumber = $(".tabs_phonenumber_service .tab-new-number").hasClass("w--current") ? "Yes" : "No";
        Store.local.write(Store.keys.checkoutFlow.getNewNumber, getNewNumber);

        const period = (() => {
            const monthly = $("#monthly-plan").hasClass("w--current");
            const annual = $("#annual-plan").hasClass("w--current");

            if (monthly) {
                return "Monthly";
            } else if (annual) {
                return "Annual";
            } else {
                return "";
            }
        })();
        Store.local.write(Store.keys.checkoutFlow.period, period);

        const addHandsetPhone = undefined;
        Store.local.write(Store.keys.checkoutFlow.addHandsetPhone, addHandsetPhone);

        const addInsurance = undefined;
        Store.local.write(Store.keys.checkoutFlow.addInsurance, addInsurance);
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
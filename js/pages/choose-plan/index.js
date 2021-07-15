$(document).ready(() => {

    /**
     * Here we handle submit button click.
     */
    const submitButton = document.querySelectorAll(".continue_choose_plan")[0];

    $(submitButton).on("click", (event) => {
        const getNewNumber = $(".tabs_phonenumber_service .tab-new-number").hasClass("w--current");
        Store.local.write(CheckoutFlowStoreKey.getNewNumber, getNewNumber);

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
        Store.local.write(CheckoutFlowStoreKey.period, period);

        const addHandsetPhone = undefined;
        Store.local.write(CheckoutFlowStoreKey.addHandsetPhone, addHandsetPhone);

        const addInsurance = undefined;
        Store.local.write(CheckoutFlowStoreKey.addInsurance, addInsurance);
    });

    exportCheckoutFlowDataToActiveCampaign(
        (response, error, success) => {
            console.log("Active Campaign");
        }
    );
});
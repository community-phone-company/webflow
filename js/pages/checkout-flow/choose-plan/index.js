$(document).ready(() => {

    const formData = {
        monthly: $("#monthly-plan").hasClass("w--current"),
        getNewNumber: $(".tabs_phonenumber_service .tab-new-number").hasClass("w--current"),
        addHandset: false,
        addInsurance: false
    };

    const getProductIdentifiers = () => {
        var identifiers = [
            formData.monthly ? ProductIdentifier.landlinePhoneServiceMonthly : ProductIdentifier.landlinePhoneServiceYearly,
            ProductIdentifier.landlineBase,
        ];

        if (!formData.getNewNumber) {
            identifiers.push(
                formData.monthly ? ProductIdentifier.portingLandlineNumberMonthly : ProductIdentifier.portingLandlineNumberYearly
            );
        }

        if (formData.addHandset) {
            identifiers.push(
                ProductIdentifier.handset
            );
        }

        if (formData.addInsurance) {
            identifiers.push(
                formData.monthly ? ProductIdentifier.insuranceMonthly : ProductIdentifier.insuranceYearly
            );
        }

        return identifiers;
    };

    $("#tab-new-number").on("click", (event) => {
        formData.getNewNumber = true;
    });

    $("#tab-keep-existing-number").on("click", (event) => {
        formData.getNewNumber = false;
    });

    $("#monthly-plan").on("click", (event) => {
        formData.monthly = true;
    });

    $("#annual-plan").on("click", (event) => {
        formData.monthly = false;
    });

    $("#monthly-plan-p").on("click", (event) => {
        formData.monthly = true;
    });

    $("#annual-plan-p").on("click", (event) => {
        formData.monthly = false;
    });

    $("#handset-addon-card").on("click", (event) => {
        formData.addHandset = !formData.addHandset;
    });

    $("#insurance-addon-card").on("click", (event) => {
        formData.addInsurance = !formData.addInsurance;
    });

    /**
     * Here we handle submit button click.
     */
    const submitButton = document.querySelectorAll(".continue_choose_plan")[0];

    $(submitButton).on("click", (event) => {
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

        Store.local.write(Store.keys.checkoutFlow.getNewNumber, formData.getNewNumber);
        Store.local.write(Store.keys.checkoutFlow.period, period);
        Store.local.write(Store.keys.checkoutFlow.addHandsetPhone, formData.addHandset);
        Store.local.write(Store.keys.checkoutFlow.addInsurance, formData.addInsurance);
        Store.local.write(Store.keys.checkoutFlow.selectedProductIdentifiers, getProductIdentifiers());
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
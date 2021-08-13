const checkCoveragePopup = document.getElementById("wf-form-service-address");
const checkCoveragePopupSubmitButton = checkCoveragePopup.querySelectorAll("input[type='submit']")[0];

const checkCoverageVM = new Vue({
    el: "#form-normal",
    data: {
        addressLineOne: "",
        city: "",
        zip: "",
        state: "AL",
        isBusiness: false
    },
    methods: {
        getSubmitButton() {
            return $("#form-normal input[type='submit']")[0];
        },
        handleDataChange() {
            const isFormValid = this.addressLineOne.length > 0
                && this.city.length > 0
                && this.zip.length > 0
                && this.state.length > 0;
            logger.print(`is form valid: ${isFormValid}`);
            UserInterface.setElementEnabled(
                this.getSubmitButton(),
                isFormValid
            );
        }
    },
    watch: {
        addressLineOne(newValue) {
            this.handleDataChange();
        },
        city(newValue) {
            this.handleDataChange();
        },
        zip(newValue) {
            this.handleDataChange();
        },
        state(newValue) {
            this.handleDataChange();
        },
        isBusiness(newValue) {
            this.handleDataChange();
        }
    }
});

const useLegacyApiForZipRequest = false;

$(document).ready(() => {
    
    const zipForms = Object.freeze({
        top: new ZipForm(
            "#zip-code-form-hero",
            "#zip-check-top"
        ),
        bottom: new ZipForm(
            "#zip-code-form-bottom",
            "#zip-check-bottom"
        )
    });

    const allZipForms = [
        zipForms.top,
        //zipForms.bottom
    ];

    allZipForms.forEach(form => {
        form.setState(
            ZipFormState.withMode(
                ZipFormStateMode.initial
            )
        );

        checkZipOnChange(
            form.getZipInput(),
            (zip) => {
                logger.print(`sending zip code: ${zip}`);
                form.setState(
                    ZipFormState.withMode(
                        ZipFormStateMode.loading
                    )
                );
            },
            (zip, response, isValid) => {
                logger.print(`zip: ${zip}\nresponse: ${response}\nisValid: ${isValid}`)

                /**
                 * This is a temporary workaround.
                 * Response, that comes from the server, has wrong content.
                 * We currently replace it with predefined content on the client side.
                 * Remove the next `if(response) {...}` block when it's fixed on the server side.
                 */
                const message = (() => {
                    if (response) {
                        if (isValid) {
                            return `
                                We have coverage in your area!
                                Click to get started, or give us a call
                                to talk to one of our landline specialists.
                            `;
                        } else {
                            return `
                                We might have coverage at your address!
                                Call us at <a href="tel:8885824177">888-582-4177</a>
                                so we can check our coverage at your address.
                            `;
                        }
                    }

                    return undefined;
                })();

                const mode = isValid ? ZipFormStateMode.success : ZipFormStateMode.error;
                form.setState(
                    new ZipFormState(
                        mode,
                        message,
                        response
                    )
                );
            },
            useLegacyApiForZipRequest
        );

        $(form.getForm()).submit(event => {
            event.preventDefault();
        });

        $(form.getSubmitButton()).on("click", (event) => {
            event.preventDefault();
            const zipCode = form.getZipInput().value;
            Store.local.write(
                Store.keys.checkoutFlow.shippingAddress_zip,
                zipCode
            );
            window.location.href = "/checkout-landline/choose-a-plan";
        });
    });

    const checkCoverageButtons = [
        document.getElementById("check-coverage"),
        document.getElementById("check-coverage-2"),
        document.getElementById("check-coverage-middle"),
        document.getElementById("check-coverage-middle-2")
    ];

    checkCoverageButtons.forEach(button => {
        $(button).off().on("click", (event) => {
            event.preventDefault();
            $(".popup-service-address").show();
        });
    });

    /**
     * Setup check coverage popup.
     */
    $("#Home").off().on("click", (event) => {
        checkCoverageVM.isBusiness = false;
    });
    $("#Business").off().on("click", (event) => {
        checkCoverageVM.isBusiness = true;
    });
    $(checkCoverageVM.getSubmitButton()).off().on("click", (event) => {
        const address = checkCoverageVM.addressLineOne;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_addressLine1,
            address
        );

        const city = checkCoverageVM.city;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_city,
            city
        );

        const state = checkCoverageVM.state;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_state,
            state
        );

        const zip = checkCoverageVM.zip;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_zip,
            zip
        );

        const isBusiness = checkCoverageVM.isBusiness;
        
        GoogleDocIntegration.addLineToServiceAddressCheck(
            address,
            city,
            state,
            zip,
            isBusiness
        );

        const checkCoverageButtonTitle = "Start your service";
        const checkCoverageButtonClickHandler = (event) => {
            event.preventDefault();
            router.open(
                RouterPath.checkoutLandline_choosePlan
            );
        };
        checkCoverageButtons.forEach(button => {
            $(button).find("div,strong").html(checkCoverageButtonTitle);
            $(button).off().on("click", checkCoverageButtonClickHandler);
        });
    });
    checkCoverageVM.handleDataChange();
});
logger.print(`VERSION `, 1);
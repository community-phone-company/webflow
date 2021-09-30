const isVersionOne = router.getParameterValue(RouterPathParameter.checkoutVersion_1) != undefined;
const orderBySalesperson = router.getParameterValue(RouterPathParameter.sales) != undefined;
const isTestingPortPhoneNumberFunctionality = router.getParameterValue("test-port-number") != undefined;

Store.removeCheckoutData();

const externalServices = {
    msp: {
        enabled: router.getParameterValue("msp") != undefined
    },
    wirefly: {
        enabled: router.getParameterValue("wirefly") != undefined
    }
};

const elements = {
    externalServices: {
        msp: {
            logo: document.querySelectorAll("#logo-msp")[0]
        },
        wirefly: {
            logo: document.querySelectorAll("#logo-wirefly")[0]
        }
    },
    checkCoveragePopup: (() => {
        const container = document.querySelectorAll("#popup-service-address")[0];
        return {
            container: container.querySelectorAll("#popup-service-address")[0],
            closeButton: container.querySelectorAll("#close-button")[0],
            form: {
                container: container.querySelectorAll("#form-normal")[0],
                submitButton: () => {
                    return container.querySelectorAll("#form-normal input[type='submit']")[0];
                },
            },
            startServiceButton: container.querySelectorAll("#popup-start-your-service-button")[0],
            learnMoreButton: container.querySelectorAll("#popup-learn-more-button")[0],
            popup: new Popup("#popup-service-address")
        };
    })(),
    checkCoverageButtons: [
        document.querySelectorAll("#check-coverage")[0],
        document.querySelectorAll("#check-coverage-2")[0],
        document.querySelectorAll("#check-coverage-middle")[0],
        document.querySelectorAll("#check-coverage-middle-2")[0]
    ]
};

const checkCoverageVM = new Vue({
    el: elements.checkCoveragePopup.form.container,
    data: {
        addressLineOne: "",
        addressLineTwo: "",
        city: "",
        zip: "",
        state: "AL",
        isBusiness: false
    },
    methods: {
        handleDataChange() {
            const isFormValid = this.addressLineOne.length > 0
                && this.city.length > 0
                && this.zip.length == 5
                && this.state.length > 0;
            console.log(`is form valid: ${isFormValid}`);
            UserInterface.setElementEnabled(
                elements.checkCoveragePopup.form.submitButton(),
                isFormValid
            );
        },
        /**
         * @param {(isCorrect: boolean) => void} callback 
         */
        isAddressCorrect(callback) {
            const _this = this;
            
            const billingAddress = new ProductCartBillingAddress(
                _this.city,
                _this.state,
                _this.zip
            );

            const productCart = new ProductCart();
            productCart.setBillingAddress(
                billingAddress    
            );
            productCart.addProductIdentifier("landline-phone-service-monthly");
            productCart.addProductIdentifier("shipmonk-box-without-handset");
            productCart.updatePrices((error) => {
                const isCorrect = error == undefined;
                callback(
                    isCorrect
                );
            });
        },
        onCorrectAddress() {
            const checkCoverageButtonTitle = "Start your service";
            const checkCoverageButtonClickHandler = (event) => {
                event.preventDefault();
                $(".popup-service-address").remove();
                openCheckout();
            };
            elements.checkCoverageButtons.forEach(button => {
                $(button).find("div,strong").html(checkCoverageButtonTitle);
                $(button).off().on("click", checkCoverageButtonClickHandler);
            });
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

const openCheckout = () => {
    const path = (() => {
        if (isTestingPortPhoneNumberFunctionality) {
            return "checkout-v2/choose-plan-and-number-2";
        }

        if (isVersionOne) {
            return RouterPath.checkoutLandline_choosePlan;
        } else {
            return IS_MOBILE ? RouterPath.checkout_v2_choosePlan : RouterPath.checkout_v2_choosePlanAndNumber;
        }
    })();
    router.open(
        path,
        router.getParameters(),
        false
    );
};

const useLegacyApiForZipRequest = false;

$(document).ready(() => {

    if (externalServices.msp.enabled) {
        $(elements.externalServices.msp.logo).show();
    }

    if (externalServices.wirefly.enabled) {
        $(elements.externalServices.wirefly.logo).show();
    }
    
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
                console.log(`sending zip code: ${zip}`);
                form.setState(
                    ZipFormState.withMode(
                        ZipFormStateMode.loading
                    )
                );
            },
            (zip, response, isValid) => {
                console.log(`zip: ${zip}\nresponse: ${response}\nisValid: ${isValid}`)

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

        $(elements.checkCoveragePopup.form.submitButton()).on("click", (event) => {
            event.preventDefault();
            const zipCode = form.getZipInput().value;
            Store.local.write(
                Store.keys.checkoutFlow.shippingAddress_zip,
                zipCode
            );
            openCheckout();
        });
    });

    $(elements.checkCoverageButtons).off().on("click", (event) => {
        event.preventDefault();
        elements.checkCoveragePopup.popup.show();
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
    $(elements.checkCoveragePopup.form.submitButton()).off().on("click", (event) => {
        const addressLineOne = checkCoverageVM.addressLineOne;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_addressLine1,
            addressLineOne
        );

        const addressLineTwo = checkCoverageVM.addressLineTwo;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_addressLine2,
            addressLineTwo
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
        Store.local.write(
            Store.keys.checkoutFlow.isBusinessCustomer,
            isBusiness
        );

        Store.local.write(
            Store.keys.checkoutFlow.orderedBySalesperson,
            orderBySalesperson
        );

        const sendToServiceAddressCheck = IS_PRODUCTION && !addressLineOne.toLowerCase().startsWith("CommunityPhone");
        
        if (sendToServiceAddressCheck) {
            GoogleDocIntegration.addLineToServiceAddressCheck(
                addressLineOne,
                city,
                state,
                zip,
                isBusiness,
                true
            );
        }

        /**
         * Uncomment the block below to check address.
         */
        /*checkCoverageVM.isAddressCorrect((isCorrect) => {
            if (isCorrect) {
                checkCoverageVM.onCorrectAddress();
            } else {
                $("#service-address .success-message-2").hide();
                $("#service-address #wf-form-service-address").show();
                alert(`Zip code ${zip} is not correct.\nTry another zip code.`);
            }
        });*/

        checkCoverageVM.onCorrectAddress();
    });
    $(elements.checkCoveragePopup.startServiceButton).on("click", (event) => {
        event.preventDefault();
        openCheckout();
    });
    $(elements.checkCoveragePopup.learnMoreButton).on("click", (event) => {
        event.preventDefault();
        elements.checkCoveragePopup.popup.hide();
    });
    checkCoverageVM.handleDataChange();

    setTimeout(() => {
        $("#check-coverage-middle").off().on("click", (e) => {
            e.preventDefault();
            alert("Test");
        });
        console.log("REGISTERED!")
    }, 4000);
});
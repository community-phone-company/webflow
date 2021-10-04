const isVersionOne = router.getParameterValue(RouterPathParameter.checkoutVersion_1) != undefined;
const orderBySalesperson = router.getParameterValue(RouterPathParameter.sales) != undefined;
const isTestingPortPhoneNumberFunctionality = router.getParameterValue("test-port-number") != undefined;

Store.removeCheckoutData();

const addressSuggestionsManager = new AddressSuggestionsManager();

const externalServices = {
    msp: {
        enabled: router.getParameterValue("msp") != undefined
    },
    wirefly: {
        enabled: router.getParameterValue("wirefly") != undefined
    }
};

const formData = {
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    zip: "",
    state: "AL",
    isBusiness: false
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
                addressLineOneInput: container.querySelectorAll("#service-address-line-one-input")[0],
                addressLineTwoInput: container.querySelectorAll("#service-address-line-two-input")[0],
                cityInput: container.querySelectorAll("#service-address-city-input")[0],
                zipInput: container.querySelectorAll("#service-address-zip-input")[0],
                stateSelect: container.querySelectorAll("#service-address-state-input")[0],
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

new InputValueObserver(elements.checkCoveragePopup.form.addressLineOneInput).startObserving(newValue => {
    formData.addressLineOne = newValue;
    handleDataChange();

    if (!IS_PRODUCTION) {
        if (newValue.length) {
            addressSuggestionsManager.getAutocompletions(newValue, (results, error) => {
                const addresses = results.map(el => {
                    return `${el.primaryLine}, ${el.city}, ${el.state} ${el.zipCode}`;
                });
                setAutocompletionItems(
                    addresses,
                    newValue
                );
            });
        } else {
            setAutocompletionItems(
                [],
                ""
            );
        }
    }
});
new InputValueObserver(elements.checkCoveragePopup.form.addressLineTwoInput).startObserving(newValue => {
    formData.addressLineTwo = newValue;
    handleDataChange();
});
new InputValueObserver(elements.checkCoveragePopup.form.cityInput).startObserving(newValue => {
    formData.city = newValue;
    handleDataChange();
});
new InputValueObserver(elements.checkCoveragePopup.form.zipInput).startObserving(newValue => {
    formData.zip = newValue;
    handleDataChange();
});
new InputValueObserver(elements.checkCoveragePopup.form.stateSelect).startObserving(newValue => {
    formData.state = newValue;
    handleDataChange();
});

const handleDataChange = () => {
    const isFormValid = formData.addressLineOne.length > 0
        && formData.city.length > 0
        && formData.zip.length == 5
        && formData.state.length > 0;
    console.log(`is form valid: ${isFormValid}`);
    UserInterface.setElementEnabled(
        elements.checkCoveragePopup.form.submitButton(),
        isFormValid
    );
};

/**
 * @param {(isCorrect: boolean) => void} callback 
 */
const isAddressCorrect = (callback) => {
    const billingAddress = new ProductCartBillingAddress(
        formData.city,
        formData.state,
        formData.zip
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
};

const onCorrectAddress = () => {
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
};

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

    if (window.location.href.includes("landline-service-2")) {
        elements.checkCoveragePopup.popup.setWebflowCompatible(true);
    }

    $(elements.checkCoverageButtons).off().on("click", (event) => {
        event.preventDefault();
        elements.checkCoveragePopup.popup.show();
    });
    
    /**
     * Setup check coverage popup.
     */
    $("#Home").off().on("click", (event) => {
        formData.isBusiness = false;
    });
    $("#Business").off().on("click", (event) => {
        formData.isBusiness = true;
    });
    $(elements.checkCoveragePopup.form.submitButton()).off().on("click", (event) => {
        const addressLineOne = formData.addressLineOne;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_addressLine1,
            addressLineOne
        );

        const addressLineTwo = formData.addressLineTwo;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_addressLine2,
            addressLineTwo
        );

        const city = formData.city;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_city,
            city
        );

        const state = formData.state;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_state,
            state
        );

        const zip = formData.zip;
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_zip,
            zip
        );

        const isBusiness = formData.isBusiness;
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
        /*isAddressCorrect((isCorrect) => {
            if (isCorrect) {
                onCorrectAddress();
            } else {
                $("#service-address .success-message-2").hide();
                $("#service-address #wf-form-service-address").show();
                alert(`Zip code ${zip} is not correct.\nTry another zip code.`);
            }
        });*/

        onCorrectAddress();
    });
    $(elements.checkCoveragePopup.startServiceButton).on("click", (event) => {
        event.preventDefault();
        openCheckout();
    });
    $(elements.checkCoveragePopup.learnMoreButton).on("click", (event) => {
        event.preventDefault();
        elements.checkCoveragePopup.popup.hide();
    });
    handleDataChange();
});
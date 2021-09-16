const is_v2 = window.location.href.includes(RouterPath.checkout_v2_checkoutStep);

/**
 * Adds Google Maps functionality to the text field.
 * @param {HTMLInputElement} textField `HTMLInputElement` instance.
 */
const makeAddressTextField = (textField) => {
    if ($(textField).hasClass("gpa-input")) {
        var autocomplete = new google.maps.places.Autocomplete(textField);
    }
};

// redirectToPreviousCheckoutFlowStepIfNeeded();

var clipboard = new ClipboardJS('.btn');

const onReady = () => {

    console.log(`On ready`);

    const form = {
        elements: {
            form: document.getElementById("wf-form-Checkout-form"),
            shippingAddress: {
                firstNameInput: document.getElementById("shipping-address-first-name-input"),
                lastNameInput: document.getElementById("shipping-address-last-name-input"),
                addressLineOneInput: document.getElementById("shipping-address-line-one-input"),
                addressLineTwoInput: document.getElementById("shipping-address-line-two-input"),
                cityInput: document.getElementById("shipping-address-city-input"),
                zipInput: document.getElementById("shipping-address-zip-input"),
                stateSelect: document.getElementById("shipping-address-state-input")
            },
            differentBillingAddressSwitcher: new Switcher(
                document.getElementById("different-billing-address-switcher"),
                true
            ),
            differentBillingAddressLabel: document.getElementById(
                "different-billing-address-label"
            ),
            billingAddress: {
                firstNameInput: document.getElementById("billing-address-first-name-input"),
                lastNameInput: document.getElementById("billing-address-last-name-input"),
                addressLineOneInput: document.getElementById("billing-address-line-one-input"),
                addressLineTwoInput: document.getElementById("billing-address-line-two-input"),
                cityInput: document.getElementById("billing-address-city-input"),
                zipInput: document.getElementById("billing-address-zip-input"),
                stateSelect: document.getElementById("billing-address-state-input")
            },
            paymentDetails: {
                cardNumberInput: document.getElementById("card_number"),
                cardExpiryInput: document.getElementById("card_expiry"),
                cardVerificationValueInput: document.getElementById("card_cvv")
            },
            submitButton: document.getElementById("submit-button"),
            submitButtonAnimation: document.getElementById("submit-button-animation")
        },
        data: {
            shippingAddress: {
                firstName: "",
                lastName: "",
                addressLineOne: "",
                addressLineTwo: "",
                city: "",
                zip: "",
                state: ""
            },
            useShippingAddressForBilling: true,
            billingAddress: {
                firstName: "",
                lastName: "",
                addressLineOne: "",
                addressLineTwo: "",
                city: "",
                zip: "",
                state: ""
            },
            selectedPhoneNumber: (() => {
                const serializedPhoneNumber = Store.local.read(
                    Store.keys.checkoutFlow.selectedPhoneNumber
                );
                return serializedPhoneNumber && PhoneNumber.deserialize(serializedPhoneNumber);
            })(),
            paymentDetails: {
                cardNumber: "",
                cardExpiry: "",
                cardVerificationValue: ""
            }
        },
        pricing: {
            productStore: undefined,
            productCart: undefined
        }
    };

    var billingAddressForOrderSummaryPanel = undefined;

    /**
     * @param {boolean} updateOrderSummaryPanel 
     */
    const handleFormDataChanges = (updateOrderSummaryPanel) => {
        $(form.elements.differentBillingAddressLabel).html(
            form.data.useShippingAddressForBilling
                ? "Click here if billing address different from shipping"
                : "Click here if billing address is the same as shipping address"
        );

        const isShippingAddressValid = form.data.shippingAddress.firstName.length > 0
            && form.data.shippingAddress.lastName.length > 0
            && form.data.shippingAddress.addressLineOne.length > 0
            && form.data.shippingAddress.city.length > 0
            && form.data.shippingAddress.zip.length >= 5
            && form.data.shippingAddress.state.length > 0;
        
        const isBillingAddressValid = (() => {
            if (form.data.useShippingAddressForBilling) {
                return isShippingAddressValid;
            } else {
                return form.data.billingAddress.firstName.length > 0
                    && form.data.billingAddress.lastName.length > 0
                    && form.data.billingAddress.addressLineOne.length > 0
                    && form.data.billingAddress.city.length > 0
                    && form.data.billingAddress.zip.length >= 5
                    && form.data.billingAddress.state.length > 0;
            }
        })();

        const isPaymentDetailsValid = form.data.paymentDetails.cardNumber.length > 0
            && form.data.paymentDetails.cardExpiry.length > 0
            && form.data.paymentDetails.cardVerificationValue.length >= 3;
        
        const isEverythingCorrect = () => {
            if (is_v2) {
                const isPricingValid = () => {
                    return form.pricing.productCart
                        && form.pricing.productCart.amounts.dueToday != undefined
                        && form.pricing.productCart.amounts.subscription != undefined;
                };
                return isShippingAddressValid
                    && isBillingAddressValid
                    && isPaymentDetailsValid
                    && isPricingValid();
            } else {
                return isShippingAddressValid
                    && isBillingAddressValid
                    && isPaymentDetailsValid;
            }
        };
        
        UserInterface.setElementEnabled(
            form.elements.submitButton,
            isEverythingCorrect()
        );

        if (is_v2) {
            const newBillingAddressForOrderSummaryPanel = (() => {
                if (form.data.useShippingAddressForBilling) {
                    return new ProductCartBillingAddress(
                        form.data.shippingAddress.city,
                        form.data.shippingAddress.state,
                        form.data.shippingAddress.zip
                    );
                } else {
                    return new ProductCartBillingAddress(
                        form.data.billingAddress.city,
                        form.data.billingAddress.state,
                        form.data.billingAddress.zip
                    );
                }
            })();
            const shouldUpdateOrderSummaryPanel = billingAddressForOrderSummaryPanel
                ? !billingAddressForOrderSummaryPanel.equalsTo(newBillingAddressForOrderSummaryPanel)
                : true;
    
            if (shouldUpdateOrderSummaryPanel) {
                findAndUpdateOrderSummaryPanel(
                    newBillingAddressForOrderSummaryPanel,
                    (orderSummaryPanel, productStore, productCart) => {
                        form.pricing.productStore = productStore;
                        form.pricing.productCart = productCart;
                        
                        UserInterface.setElementEnabled(
                            form.elements.submitButton,
                            isEverythingCorrect()
                        );
                    }
                );
                billingAddressForOrderSummaryPanel = newBillingAddressForOrderSummaryPanel;
            }
        }
    };

    /**
     * @param {boolean} available 
     */
    const setCheckoutFormAvailable = (available) => {
        const checkoutForm = document.querySelectorAll("#Checkout-form")[0];

        if (checkoutForm) {
            UserInterface.makeElementClickable(
                checkoutForm,
                available
            );
        }
    };

    /**
     * @param {(message: string, success: boolean) => void} callback 
     */
    const buyProducts = (callback) => {
        const firstName = Store.local.read(Store.keys.checkoutFlow.firstName);
        const lastName = Store.local.read(Store.keys.checkoutFlow.lastName);
        const email = Store.local.read(Store.keys.checkoutFlow.email);
        const phone = Store.local.read(Store.keys.checkoutFlow.phone);
        const getNewNumber = Store.local.read(Store.keys.checkoutFlow.getNewNumber);
        const productIdentifiers = Store.local.read(Store.keys.checkoutFlow.selectedProductIdentifiers);
        const selectedPhoneNumber = form.data.selectedPhoneNumber && form.data.selectedPhoneNumber.formatted(PhoneNumberFormatStyle.regular);

        const portPhoneNumberData = {
            technicalData: {
                accountNumber: Store.local.read(Store.keys.portPhoneNumber.accountNumber),
                pin: Store.local.read(Store.keys.portPhoneNumber.pin),
                accountName: Store.local.read(Store.keys.portPhoneNumber.accountName),
                numberToPort: Store.local.read(Store.keys.portPhoneNumber.numberToPort)
            },
            serviceAddress: {
                firstName: Store.local.read(Store.keys.portPhoneNumber.firstName),
                lastName: Store.local.read(Store.keys.portPhoneNumber.lastName),
                addressLineOne: Store.local.read(Store.keys.portPhoneNumber.addressLineOne),
                addressLineTwo: Store.local.read(Store.keys.portPhoneNumber.addressLineTwo),
                city: Store.local.read(Store.keys.portPhoneNumber.city),
                zip: Store.local.read(Store.keys.portPhoneNumber.zip),
                state: Store.local.read(Store.keys.portPhoneNumber.state)
            }
        };

        const shippingAddress = new ChargebeeCheckoutAddress(
            form.data.shippingAddress.firstName,
            form.data.shippingAddress.lastName,
            email,
            phone,
            form.data.shippingAddress.addressLineOne,
            form.data.shippingAddress.addressLineTwo,
            form.data.shippingAddress.state,
            form.data.shippingAddress.city,
            form.data.shippingAddress.zip
        );

        const billingAddress = (() => {
            if (form.data.useShippingAddressForBilling) {
                return shippingAddress;
            } else {
                return new ChargebeeCheckoutAddress(
                    form.data.billingAddress.firstName,
                    form.data.billingAddress.lastName,
                    email,
                    phone,
                    form.data.billingAddress.addressLineOne,
                    form.data.billingAddress.addressLineTwo,
                    form.data.billingAddress.state,
                    form.data.billingAddress.city,
                    form.data.billingAddress.zip
                );
            }
        })();
        
        new Chargebee().checkout(
            new ChargebeeCheckoutCustomer(
                firstName,
                lastName,
                email,
                phone,
                ChargebeeCheckoutCustomerType.business
            ),
            (() => {
                if (getNewNumber) {
                    return selectedPhoneNumber ? ChargebeeCheckoutPhoneNumberServiceType.selectedNumber : ChargebeeCheckoutPhoneNumberServiceType.getNewNumber;
                } else {
                    return ChargebeeCheckoutPhoneNumberServiceType.portExistingNumber;
                }
            })(),
            shippingAddress,
            billingAddress,
            productIdentifiers,
            selectedPhoneNumber,
            new ChargebeeCheckoutCardInformation(
                form.data.paymentDetails.cardNumber,
                ChargebeeCheckoutCardInformationExpiryDate.parse(
                    form.data.paymentDetails.cardExpiry
                ),
                form.data.paymentDetails.cardVerificationValue
            ),
            (message, success) => {
                callback(message, success);
            }
        );
    };

    new InputValueObserver(
        form.elements.shippingAddress.firstNameInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.firstName = newValue;
        handleFormDataChanges();
    });
    form.elements.shippingAddress.firstNameInput.value = Store.local.read(
        Store.keys.checkoutFlow.firstName
    ) ?? "";

    new InputValueObserver(
        form.elements.shippingAddress.lastNameInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.lastName = newValue;
        handleFormDataChanges();
    });
    form.elements.shippingAddress.lastNameInput.value = Store.local.read(
        Store.keys.checkoutFlow.lastName
    ) ?? "";

    new InputValueObserver(
        form.elements.shippingAddress.addressLineOneInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.addressLineOne = newValue;
        handleFormDataChanges();
    });
    form.elements.shippingAddress.addressLineOneInput.value = Store.local.read(
        Store.keys.checkoutFlow.shippingAddress_addressLine1
    ) ?? "";

    new InputValueObserver(
        form.elements.shippingAddress.addressLineTwoInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.addressLineTwo = newValue;
        handleFormDataChanges();
    });

    new InputValueObserver(
        form.elements.shippingAddress.cityInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.city = newValue;
        handleFormDataChanges();
    });
    form.elements.shippingAddress.cityInput.value = Store.local.read(
        Store.keys.checkoutFlow.shippingAddress_city
    ) ?? "";

    new InputValueObserver(
        form.elements.shippingAddress.zipInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.zip = newValue.replaceAll("_", "");
        handleFormDataChanges();
    });
    form.elements.shippingAddress.zipInput.value = Store.local.read(
        Store.keys.checkoutFlow.shippingAddress_zip
    ) ?? "";

    form.elements.shippingAddress.stateSelect.onchange = () => {
        form.data.shippingAddress.state = form.elements.shippingAddress.stateSelect.value;
        handleFormDataChanges();
    };
    const initialStateCode = Store.local.read(
        Store.keys.checkoutFlow.shippingAddress_state
    ) ?? form.elements.shippingAddress.stateSelect.value;
    form.data.shippingAddress.state = initialStateCode;
    form.elements.shippingAddress.stateSelect.value = initialStateCode;

    form.elements.differentBillingAddressSwitcher.startWatchingForStateChanges((switcher) => {
        form.data.useShippingAddressForBilling = switcher.isOn();
        handleFormDataChanges();
    });

    new InputValueObserver(
        form.elements.billingAddress.firstNameInput
    ).startObserving((newValue) => {
        form.data.billingAddress.firstName = newValue;
        handleFormDataChanges();
    });

    new InputValueObserver(
        form.elements.billingAddress.lastNameInput
    ).startObserving((newValue) => {
        form.data.billingAddress.lastName = newValue;
        handleFormDataChanges();
    });

    new InputValueObserver(
        form.elements.billingAddress.addressLineOneInput
    ).startObserving((newValue) => {
        form.data.billingAddress.addressLineOne = newValue;
        handleFormDataChanges();
    });

    new InputValueObserver(
        form.elements.billingAddress.addressLineTwoInput
    ).startObserving((newValue) => {
        form.data.billingAddress.addressLineTwo = newValue;
        handleFormDataChanges();
    });

    new InputValueObserver(
        form.elements.billingAddress.cityInput
    ).startObserving((newValue) => {
        form.data.billingAddress.city = newValue;
        handleFormDataChanges();
    });

    new InputValueObserver(
        form.elements.billingAddress.zipInput
    ).startObserving((newValue) => {
        form.data.billingAddress.zip = newValue.replaceAll("_", "");
        handleFormDataChanges();
    });

    form.elements.billingAddress.stateSelect.onchange = () => {
        form.data.billingAddress.state = form.elements.billingAddress.stateSelect.value;
        handleFormDataChanges();
    };
    form.data.billingAddress.state = form.elements.billingAddress.stateSelect.value;

    new InputValueObserver(
        form.elements.paymentDetails.cardNumberInput
    ).startObserving((newValue) => {
        form.data.paymentDetails.cardNumber = newValue
            .replaceAll(" ", "")
            .replaceAll("_", "");
        handleFormDataChanges();
    });

    new InputValueObserver(
        form.elements.paymentDetails.cardExpiryInput
    ).startObserving((newValue) => {
        form.data.paymentDetails.cardExpiry = newValue.replaceAll("_", "");
        handleFormDataChanges();
    });

    new InputValueObserver(
        form.elements.paymentDetails.cardVerificationValueInput
    ).startObserving((newValue) => {
        form.data.paymentDetails.cardVerificationValue = newValue.replaceAll("_", "");
        handleFormDataChanges();
    });

    //makeAddressTextField(form.elements.shippingAddress.addressLineOneInput);

    $(form.elements.form).submit((event) => {
        event.preventDefault();
    });

    $(form.elements.submitButton).on("click", (event) => {
        event.preventDefault();

        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_firstName,
            form.data.shippingAddress.firstName
        );
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_lastName,
            form.data.shippingAddress.lastName
        );
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_addressLine1,
            form.data.shippingAddress.addressLineOne
        );
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_addressLine2,
            form.data.shippingAddress.addressLineTwo
        );
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_city,
            form.data.shippingAddress.city
        );
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_zip,
            form.data.shippingAddress.zip
        );
        Store.local.write(
            Store.keys.checkoutFlow.shippingAddress_state,
            form.data.shippingAddress.state
        );

        const useShippingAddressForBilling = form.data.useShippingAddressForBilling;

        Store.local.write(
            Store.keys.checkoutFlow.billingAddress_firstName,
            useShippingAddressForBilling ? form.data.shippingAddress.firstName : form.data.billingAddress.firstName
        );
        Store.local.write(
            Store.keys.checkoutFlow.billingAddress_lastName,
            useShippingAddressForBilling ? form.data.shippingAddress.lastName : form.data.billingAddress.lastName
        );
        Store.local.write(
            Store.keys.checkoutFlow.billingAddress_addressLine1,
            useShippingAddressForBilling ? form.data.shippingAddress.addressLineOne : form.data.billingAddress.addressLineOne
        );
        Store.local.write(
            Store.keys.checkoutFlow.billingAddress_addressLine2,
            useShippingAddressForBilling ? form.data.shippingAddress.addressLineTwo : form.data.billingAddress.addressLineTwo
        );
        Store.local.write(
            Store.keys.checkoutFlow.billingAddress_city,
            useShippingAddressForBilling ? form.data.shippingAddress.city : form.data.billingAddress.city
        );
        Store.local.write(
            Store.keys.checkoutFlow.billingAddress_zip,
            useShippingAddressForBilling ? form.data.shippingAddress.zip : form.data.billingAddress.zip
        );
        Store.local.write(
            Store.keys.checkoutFlow.billingAddress_state,
            useShippingAddressForBilling ? form.data.shippingAddress.state : form.data.billingAddress.state
        );

        $(form.elements.submitButton).hide();
        $(form.elements.submitButtonAnimation).show();
        setCheckoutFormAvailable(
            false
        );

        exportCheckoutFlowDataToActiveCampaign((response, error, success) => {
            console.log("Active Campaign");
            buyProducts((message, success) => {
                if (success) {
                    removeCheckoutFlowDataFromStorage();
                    router.open(
                        is_v2 ? RouterPath.checkout_v2_thankYou : RouterPath.checkoutLandline_thankYou,
                        router.getParameters(),
                        router.isTestEnvironment()
                    );
                } else {
                    Popup.getBasic()
                        .setBody(message)
                        .show();
                    $(form.elements.submitButton).show();
                    $(form.elements.submitButtonAnimation).hide();
                    setCheckoutFormAvailable(
                        true
                    );
                }
            });
        });
    });

    handleFormDataChanges();

    if (is_v2) {
        // findAndUpdateOrderSummaryPanel();
    } else {
        const productIdentifiers = Store.local.read(
            Store.keys.checkoutFlow.selectedProductIdentifiers
        );
        updateOrderSummaryColumn(
            productIdentifiers
        );
    }
};

const removeCheckoutFlowDataFromStorage = () => {
    const storeKeys = Object.keys(CheckoutFlowStoreKey).map(key => CheckoutFlowStoreKey[key]);
    storeKeys.forEach(key => {
        Store.local.write(
            key,
            undefined
        );
    });
};

onReady();

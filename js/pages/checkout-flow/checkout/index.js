/**
 * Adds Google Maps functionality to the text field.
 * @param {HTMLInputElement} textField `HTMLInputElement` instance.
 */
const makeAddressTextField = (textField) => {
    if ($(textField).hasClass("gpa-input")) {
        var autocomplete = new google.maps.places.Autocomplete(textField);
    }
};

var clipboard = new ClipboardJS('.btn');

$(document).ready(() => {

    /**
     * For test only.
     */
    if (IS_PRODUCTION) {
        return;
    }

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
            submitButton: document.getElementById("submit-button")
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
            paymentDetails: {
                cardNumber: "",
                cardExpiry: "",
                cardVerificationValue: ""
            }
        }
    };

    const handleFormDataChanges = () => {
        const isShippingAddressValid = form.data.shippingAddress.firstName.length
            && form.data.shippingAddress.lastName.length
            && form.data.shippingAddress.addressLineOne.length
            && form.data.shippingAddress.city.length
            && form.data.shippingAddress.zip.length
            && form.data.shippingAddress.state.length;
        
        const isBillingAddressValid = (() => {
            if (form.data.useShippingAddressForBilling) {
                return isShippingAddressValid;
            } else {
                return form.data.billingAddress.firstName.length
                    && form.data.billingAddress.lastName.length
                    && form.data.billingAddress.addressLineOne.length
                    && form.data.billingAddress.city.length
                    && form.data.billingAddress.zip.length
                    && form.data.billingAddress.state.length;
            }
        })();

        const isPaymentDetailsValid = form.data.paymentDetails.cardNumber.length
            && form.data.paymentDetails.cardExpiry.length
            && form.data.paymentDetails.cardVerificationValue.length;
        
        const isEverythingCorrect = isShippingAddressValid
            && isBillingAddressValid
            && isPaymentDetailsValid;
        
        UserInterface.setElementEnabled(
            form.elements.submitButton,
            isEverythingCorrect
        );
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
        
        Chargebee.checkout(
            new ChargebeeCheckoutCustomer(
                firstName,
                lastName,
                email,
                phone,
                ChargebeeCheckoutCustomerType.business
            ),
            getNewNumber ? ChargebeeCheckoutPhoneNumberServiceType.getNewNumber : ChargebeeCheckoutPhoneNumberServiceType.portExistingNumber,
            new ChargebeeCheckoutAddress(
                form.data.shippingAddress.firstName,
                form.data.shippingAddress.lastName,
                email,
                phone,
                form.data.shippingAddress.addressLineOne,
                form.data.shippingAddress.addressLineTwo,
                form.data.shippingAddress.state,
                form.data.shippingAddress.city,
                form.data.shippingAddress.zip
            ),
            new ChargebeeCheckoutAddress(
                form.data.billingAddress.firstName,
                form.data.billingAddress.lastName,
                email,
                phone,
                form.data.billingAddress.addressLineOne,
                form.data.billingAddress.addressLineTwo,
                form.data.billingAddress.state,
                form.data.billingAddress.city,
                form.data.billingAddress.zip
            ),
            productIdentifiers,
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
    form.data.shippingAddress.firstName = form.elements.shippingAddress.firstNameInput.value;

    new InputValueObserver(
        form.elements.shippingAddress.lastNameInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.lastName = newValue;
        handleFormDataChanges();
    });
    form.data.shippingAddress.lastName = form.elements.shippingAddress.lastNameInput.value;

    new InputValueObserver(
        form.elements.shippingAddress.addressLineOneInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.addressLineOne = newValue;
        handleFormDataChanges();
    });
    form.data.shippingAddress.addressLineOne = form.elements.shippingAddress.addressLineOneInput.value;

    new InputValueObserver(
        form.elements.shippingAddress.addressLineTwoInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.addressLineTwo = newValue;
        handleFormDataChanges();
    });
    form.data.shippingAddress.addressLineTwo = form.elements.shippingAddress.addressLineTwoInput.value;

    new InputValueObserver(
        form.elements.shippingAddress.cityInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.city = newValue;
        handleFormDataChanges();
    });
    form.data.shippingAddress.city = form.elements.shippingAddress.cityInput.value;

    new InputValueObserver(
        form.elements.shippingAddress.zipInput
    ).startObserving((newValue) => {
        form.data.shippingAddress.zip = newValue;
        handleFormDataChanges();
    });
    form.data.shippingAddress.zip = form.elements.shippingAddress.zipInput.value;

    form.elements.shippingAddress.stateSelect.onchange = () => {
        form.data.shippingAddress.state = form.elements.shippingAddress.stateSelect.value;
        handleFormDataChanges();
    };
    form.data.shippingAddress.state = form.elements.shippingAddress.stateSelect.value;

    form.elements.differentBillingAddressSwitcher.startWatchingForStateChanges((switcher) => {
        form.data.useShippingAddressForBilling = switcher.isOn();
        handleFormDataChanges();
    });
    form.data.useShippingAddressForBilling = form.elements.differentBillingAddressSwitcher.isOn();

    new InputValueObserver(
        form.elements.billingAddress.firstNameInput
    ).startObserving((newValue) => {
        form.data.billingAddress.firstName = newValue;
        handleFormDataChanges();
    });
    form.data.billingAddress.firstName = form.elements.billingAddress.firstNameInput.value;

    new InputValueObserver(
        form.elements.billingAddress.lastNameInput
    ).startObserving((newValue) => {
        form.data.billingAddress.lastName = newValue;
        handleFormDataChanges();
    });
    form.data.billingAddress.lastName = form.elements.billingAddress.lastNameInput.value;

    new InputValueObserver(
        form.elements.billingAddress.addressLineOneInput
    ).startObserving((newValue) => {
        form.data.billingAddress.addressLineOne = newValue;
        handleFormDataChanges();
    });
    form.data.billingAddress.addressLineOne = form.elements.billingAddress.addressLineOneInput.value;

    new InputValueObserver(
        form.elements.billingAddress.addressLineTwoInput
    ).startObserving((newValue) => {
        form.data.billingAddress.addressLineTwo = newValue;
        handleFormDataChanges();
    });
    form.data.billingAddress.addressLineTwo = form.elements.billingAddress.addressLineTwoInput.value;

    new InputValueObserver(
        form.elements.billingAddress.cityInput
    ).startObserving((newValue) => {
        form.data.billingAddress.city = newValue;
        handleFormDataChanges();
    });
    form.data.billingAddress.city = form.elements.billingAddress.cityInput.value;

    new InputValueObserver(
        form.elements.billingAddress.zipInput
    ).startObserving((newValue) => {
        form.data.billingAddress.zip = newValue;
        handleFormDataChanges();
    });
    form.data.billingAddress.zip = form.elements.billingAddress.zipInput.value;

    form.elements.billingAddress.stateSelect.onchange = () => {
        form.data.billingAddress.state = form.elements.billingAddress.stateSelect.value;
        handleFormDataChanges();
    };
    form.data.billingAddress.state = form.elements.billingAddress.stateSelect.value;

    new InputValueObserver(
        form.elements.paymentDetails.cardNumberInput
    ).startObserving((newValue) => {
        form.data.paymentDetails.cardNumber = newValue;
        handleFormDataChanges();
    });
    form.data.paymentDetails.cardNumber = form.elements.paymentDetails.cardNumberInput.value;

    new InputValueObserver(
        form.elements.paymentDetails.cardExpiryInput
    ).startObserving((newValue) => {
        form.data.paymentDetails.cardExpiry = newValue;
        handleFormDataChanges();
    });
    form.data.paymentDetails.cardExpiry = form.elements.paymentDetails.cardExpiryInput.value;

    new InputValueObserver(
        form.elements.paymentDetails.cardVerificationValueInput
    ).startObserving((newValue) => {
        form.data.paymentDetails.cardVerificationValue = newValue;
        handleFormDataChanges();
    });
    form.data.paymentDetails.cardVerificationValue = form.elements.paymentDetails.cardVerificationValueInput.value;

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

        exportCheckoutFlowDataToActiveCampaign(
            (response, error, success) => {
                logger.print("Active Campaign");
                buyProducts((message, success) => {
                });
            }
        );
    });

    handleFormDataChanges();
});
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

var _formData = undefined;

$(document).ready(() => {

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

    const handleFormChanges = () => {
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

        _formData = form.data;
    };

    /**
     * Currently we test this functionality, so that's why we excluded production domain here.
     */
    if (!IS_PRODUCTION) {
        new InputValueObserver(
            form.elements.shippingAddress.firstNameInput
        ).startObserving((newValue) => {
            form.data.shippingAddress.firstName = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.shippingAddress.lastNameInput
        ).startObserving((newValue) => {
            form.data.shippingAddress.lastName = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.shippingAddress.addressLineOneInput
        ).startObserving((newValue) => {
            form.data.shippingAddress.addressLineOne = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.shippingAddress.addressLineTwoInput
        ).startObserving((newValue) => {
            form.data.shippingAddress.addressLineTwo = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.shippingAddress.cityInput
        ).startObserving((newValue) => {
            form.data.shippingAddress.city = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.shippingAddress.zipInput
        ).startObserving((newValue) => {
            form.data.shippingAddress.zip = newValue;
            handleFormChanges();
        });
    
        form.elements.shippingAddress.stateSelect.onchange = () => {
            form.data.shippingAddress.state = form.elements.shippingAddress.stateSelect.value;
            handleFormChanges();
        };
    
        form.elements.differentBillingAddressSwitcher.startWatchingForStateChanges((switcher) => {
            form.data.useShippingAddressForBilling = switcher.isOn();
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.billingAddress.firstNameInput
        ).startObserving((newValue) => {
            form.data.billingAddress.firstName = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.billingAddress.lastNameInput
        ).startObserving((newValue) => {
            form.data.billingAddress.lastName = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.billingAddress.addressLineOneInput
        ).startObserving((newValue) => {
            form.data.billingAddress.addressLineOne = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.billingAddress.addressLineTwoInput
        ).startObserving((newValue) => {
            form.data.billingAddress.addressLineTwo = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.billingAddress.cityInput
        ).startObserving((newValue) => {
            form.data.billingAddress.city = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.billingAddress.zipInput
        ).startObserving((newValue) => {
            form.data.billingAddress.zip = newValue;
            handleFormChanges();
        });
    
        form.elements.billingAddress.stateSelect.onchange = () => {
            form.data.billingAddress.state = form.elements.billingAddress.stateSelect.value;
            handleFormChanges();
        };
    
        new InputValueObserver(
            form.elements.paymentDetails.cardNumberInput
        ).startObserving((newValue) => {
            form.data.paymentDetails.cardNumber = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.paymentDetails.cardExpiryInput
        ).startObserving((newValue) => {
            form.data.paymentDetails.cardExpiry = newValue;
            handleFormChanges();
        });
    
        new InputValueObserver(
            form.elements.paymentDetails.cardVerificationValueInput
        ).startObserving((newValue) => {
            form.data.paymentDetails.cardVerificationValue = newValue;
            handleFormChanges();
        });

        makeAddressTextField(form.elements.shippingAddress.addressLineOneInput);
        handleFormChanges();
    }

    /**
     * Here we handle submit button click.
     */
    $(form.elements.submitButton).on("click", (event) => {
        const shippingAddress_firstName = $("#First-name").val();
        Store.local.write(Store.keys.checkoutFlow.shippingAddress_firstName, shippingAddress_firstName);

        const shippingAddress_lastName = $("#Last-name").val();
        Store.local.write(Store.keys.checkoutFlow.shippingAddress_lastName, shippingAddress_lastName);

        const shippingAddress_addressLine1 = $(addressLineOneInput).val();
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
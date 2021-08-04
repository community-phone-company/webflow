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

    const formData = {
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
        const isShippingAddressValid = formData.data.shippingAddress.firstName.length
            && formData.data.shippingAddress.lastName.length
            && formData.data.shippingAddress.addressLineOne.length
            && formData.data.shippingAddress.addressLineTwo.length
            && formData.data.shippingAddress.city.length
            && formData.data.shippingAddress.zip.length
            && formData.data.shippingAddress.state.length;
        
        const isBillingAddressValid = (() => {
            if (formData.data.useShippingAddressForBilling) {
                return isShippingAddressValid;
            } else {
                return formData.data.billingAddress.firstName.length
                    && formData.data.billingAddress.lastName.length
                    && formData.data.billingAddress.addressLineOne.length
                    && formData.data.billingAddress.addressLineTwo.length
                    && formData.data.billingAddress.city.length
                    && formData.data.billingAddress.zip.length
                    && formData.data.billingAddress.state.length;
            }
        })();

        const isPaymentDetailsValid = formData.data.paymentDetails.cardNumber.length
            && formData.data.paymentDetails.cardExpiry.length
            && formData.data.paymentDetails.cardVerificationValue.length;
        
        const isEverythingCorrect = isShippingAddressValid
            && isBillingAddressValid
            && isPaymentDetailsValid;
        
        UserInterface.setElementEnabled(
            formData.elements.submitButton,
            isEverythingCorrect
        );
    };

    new InputValueObserver(
        formData.elements.shippingAddress.firstNameInput
    ).startObserving((newValue) => {
        formData.data.shippingAddress.firstName = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.shippingAddress.lastNameInput
    ).startObserving((newValue) => {
        formData.data.shippingAddress.lastName = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.shippingAddress.addressLineOneInput
    ).startObserving((newValue) => {
        formData.data.shippingAddress.addressLineOne = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.shippingAddress.addressLineTwoInput
    ).startObserving((newValue) => {
        formData.data.shippingAddress.addressLineTwo = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.shippingAddress.cityInput
    ).startObserving((newValue) => {
        formData.data.shippingAddress.city = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.shippingAddress.zipInput
    ).startObserving((newValue) => {
        formData.data.shippingAddress.zip = newValue;
        handleFormChanges();
    });

    formData.elements.shippingAddress.stateSelect.onchange = () => {
        formData.data.shippingAddress.state = formData.elements.shippingAddress.stateSelect.value;
        handleFormChanges();
    };

    formData.elements.differentBillingAddressSwitcher.startWatchingForStateChanges((switcher) => {
        formData.data.useShippingAddressForBilling = switcher.isOn();
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.billingAddress.firstNameInput
    ).startObserving((newValue) => {
        formData.data.billingAddress.firstName = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.billingAddress.lastNameInput
    ).startObserving((newValue) => {
        formData.data.billingAddress.lastName = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.billingAddress.addressLineOneInput
    ).startObserving((newValue) => {
        formData.data.billingAddress.addressLineOne = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.billingAddress.addressLineTwoInput
    ).startObserving((newValue) => {
        formData.data.billingAddress.addressLineTwo = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.billingAddress.cityInput
    ).startObserving((newValue) => {
        formData.data.billingAddress.city = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.billingAddress.zipInput
    ).startObserving((newValue) => {
        formData.data.billingAddress.zip = newValue;
        handleFormChanges();
    });

    formData.elements.billingAddress.stateSelect.onchange = () => {
        formData.data.billingAddress.state = formData.elements.billingAddress.stateSelect.value;
        handleFormChanges();
    };

    new InputValueObserver(
        formData.elements.paymentDetails.cardNumberInput
    ).startObserving((newValue) => {
        formData.data.paymentDetails.cardNumber = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.paymentDetails.cardExpiryInput
    ).startObserving((newValue) => {
        formData.data.paymentDetails.cardExpiry = newValue;
        handleFormChanges();
    });

    new InputValueObserver(
        formData.elements.paymentDetails.cardVerificationValueInput
    ).startObserving((newValue) => {
        formData.data.paymentDetails.cardVerificationValue = newValue;
        handleFormChanges();
    });

    /*
     * Address line 1.
     */
    const addressLineOneInput = formData.elements.shippingAddress.addressLineOneInput;
    makeAddressTextField(addressLineOneInput);

    /**
     * Here we handle submit button click.
     */
     const submitButton = document.querySelectorAll(".buy_now_checkout")[0];

     $(submitButton).on("click", (event) => {
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
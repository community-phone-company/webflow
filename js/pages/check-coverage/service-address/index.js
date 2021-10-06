const orderBySalesperson = router.getParameterValue(RouterPathParameter.sales) != undefined;

const page = {
    elements: {
        form: document.querySelectorAll("#wf-form-service-address")[0],
        addressLineOneInput: document.querySelectorAll("#service-address-line-one-input")[0],
        addressLineTwoInput: document.querySelectorAll("#service-address-line-two-input")[0],
        cityInput: document.querySelectorAll("#service-address-city-input")[0],
        zipInput: document.querySelectorAll("#service-address-zip-input")[0],
        stateSelect: document.querySelectorAll("#service-address-state-input")[0],
        submitButton: document.querySelectorAll("#submit-button")[0]
    },
    data: {
        addressLineOne: "",
        addressLineTwo: "",
        city: "",
        zip: "",
        state: "AL",
        isBusiness: false,
        lastSelectedAddressSuggestion: undefined
    }
};

const addressSuggestionsManager = new AddressSuggestionsManager();

/**
 * @param {string} searchQuery 
 */
const onRequestedAddressSuggestions = (searchQuery) => {
    if (!IS_PRODUCTION) {
        const isSearchQueryEmpty = !searchQuery.length;
        const isSearchQueryEqualToLastSelectedSuggestion = searchQuery === (page.data.lastSelectedAddressSuggestion && page.data.lastSelectedAddressSuggestion.primaryLine);

        if (isSearchQueryEmpty || isSearchQueryEqualToLastSelectedSuggestion) {
            setAutocompletionItems([]);
        } else {
            addressSuggestionsManager.getAutocompletions(searchQuery, (results, error) => {
                setAutocompletionItems(results, searchQuery, suggestion => {
                    setAutocompletionItems([]);
                    page.data.lastSelectedAddressSuggestion = suggestion;
                    page.elements.addressLineOneInput.value = suggestion.primaryLine;
                    page.elements.addressLineTwoInput.value = "";
                    page.elements.cityInput.value = suggestion.city;
                    page.elements.zipInput.value = suggestion.zipCode;
                    page.elements.stateSelect.value = suggestion.state;
                });
            });
        }
    }
};
new InputValueObserver(page.elements.addressLineOneInput).startObserving(newValue => {
    page.data.addressLineOne = newValue;
    handleDataChange();
    onRequestedAddressSuggestions(
        newValue
    );
});
page.elements.addressLineOneInput.onfocus = () => {
    onRequestedAddressSuggestions(
        page.elements.addressLineOneInput.value
    );
};
page.elements.addressLineOneInput.onfocusout = () => {
    // setAutocompletionItems([]);
};
new InputValueObserver(page.elements.addressLineTwoInput).startObserving(newValue => {
    page.data.addressLineTwo = newValue;
    handleDataChange();
});
new InputValueObserver(page.elements.cityInput).startObserving(newValue => {
    page.data.city = newValue;
    handleDataChange();
});
new InputValueObserver(page.elements.zipInput).startObserving(newValue => {
    page.data.zip = newValue;
    handleDataChange();
});
new InputValueObserver(page.elements.stateSelect).startObserving(newValue => {
    page.data.state = newValue;
    handleDataChange();
});

const handleDataChange = () => {
    const isFormValid = page.data.addressLineOne.length > 0
        && page.data.city.length > 0
        && page.data.zip.length == 5
        && page.data.state.length > 0;
    console.log(`is form valid: ${isFormValid}`);
    UserInterface.setElementEnabled(
        page.elements.submitButton,
        isFormValid
    );
};

/**
 * @param {(isCorrect: boolean) => void} callback 
 */
const isAddressCorrect = (callback) => {
    const billingAddress = new ProductCartBillingAddress(
        page.data.city,
        page.data.state,
        page.data.zip
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

const submitForm = () => {
    const addressLineOne = page.data.addressLineOne;
    Store.local.write(
        Store.keys.checkoutFlow.shippingAddress_addressLine1,
        addressLineOne
    );

    const addressLineTwo = page.data.addressLineTwo;
    Store.local.write(
        Store.keys.checkoutFlow.shippingAddress_addressLine2,
        addressLineTwo
    );

    const city = page.data.city;
    Store.local.write(
        Store.keys.checkoutFlow.shippingAddress_city,
        city
    );

    const state = page.data.state;
    Store.local.write(
        Store.keys.checkoutFlow.shippingAddress_state,
        state
    );

    const zip = page.data.zip;
    Store.local.write(
        Store.keys.checkoutFlow.shippingAddress_zip,
        zip
    );

    const isBusiness = page.data.isBusiness;
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
            true,
            (response, error, success) => {
                router.open(
                    RouterPath.checkCoverage_coverage,
                    router.getParameters(),
                    router.isTestEnvironment()
                );
            }
        );
    }
};

const setupUI = () => {
    /*UserInterface.makeFormUnsubmittable(
        page.elements.form
    );

    $(page.elements.submitButton).on("cilck", (event) => {
        event.preventDefault();
        submitForm();
    });*/

    $(page.elements.form).submit((event) => {
        event.preventDefault();
        submitForm();
        return false;
    });

    handleDataChange();
};

$(document).ready(() => {
    setupUI();
});
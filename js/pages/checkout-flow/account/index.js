redirectToPreviousCheckoutFlowStepIfNeeded();

$(document).ready(() => {

    const form = {
        elements: {
            form: document.getElementById("wf-form-Account-form"),
            firstNameTextField: document.getElementById("First-name"),
            lastNameTextField: document.getElementById("Last-name"),
            phoneTextField: document.getElementById("Contact-number"),
            emailTextField: document.getElementById("Email"),
            howDidYouHearAboutUs: document.getElementById("how-did-you-hear-about-us-select"),
            submitButton: document.getElementById("submit-button")
        },
        data: {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            howDidYouHearAboutUs: ""
        }
    };

    const handleFormDataChange = () => {
        const isFormValid = form.data.firstName.length
            && form.data.lastName.length
            && form.data.phone.length
            && form.data.email.length
            && form.data.howDidYouHearAboutUs.length;
        UserInterface.setElementEnabled(
            form.elements.submitButton,
            isFormValid
        );
    };

    new InputValueObserver(
        form.elements.firstNameTextField
    ).startObserving((newValue) => {
        form.data.firstName = newValue;
        handleFormDataChange();
    });
    form.elements.firstNameTextField.value = Store.local.read(
        Store.keys.checkoutFlow.firstName
    ) ?? "";

    new InputValueObserver(
        form.elements.lastNameTextField
    ).startObserving((newValue) => {
        form.data.lastName = newValue;
        handleFormDataChange();
    });
    form.elements.lastNameTextField.value = Store.local.read(
        Store.keys.checkoutFlow.lastName
    ) ?? "";

    new InputValueObserver(
        form.elements.phoneTextField
    ).startObserving((newValue) => {
        form.data.phone = newValue;
        handleFormDataChange();
    });
    form.elements.phoneTextField.value = Store.local.read(
        Store.keys.checkoutFlow.phone
    ) ?? "";

    new InputValueObserver(
        form.elements.emailTextField
    ).startObserving((newValue) => {
        form.data.email = newValue;
        handleFormDataChange();
    });
    form.elements.emailTextField.value = Store.local.read(
        Store.keys.checkoutFlow.email
    ) ?? "";

    const howDidYouHearAboutUsPlaceholder = "Select";
    form.elements.howDidYouHearAboutUs.oninput = () => {
        const visibleValue = form.elements.howDidYouHearAboutUs.value;
        const value = visibleValue === howDidYouHearAboutUsPlaceholder ? "" : visibleValue;
        form.data.howDidYouHearAboutUs = value;
    };
    form.elements.howDidYouHearAboutUs.value = (() => {
        const valueFromStore = Store.local.read(
            Store.keys.checkoutFlow.howDidYouHearAboutUs
        ) ?? "";
        return valueFromStore.length ? valueFromStore : howDidYouHearAboutUsPlaceholder;
    })();

    $(form.elements.form).submit((event) => {
        event.preventDefault();
    });
    
    $(form.elements.submitButton).on("click", (event) => {
        event.preventDefault();

        Store.local.write(Store.keys.checkoutFlow.firstName, form.data.firstName);
        Store.local.write(Store.keys.checkoutFlow.lastName, form.data.lastName);
        Store.local.write(Store.keys.checkoutFlow.phone, form.data.phone);
        Store.local.write(Store.keys.checkoutFlow.email, form.data.email);
        Store.local.write(Store.keys.checkoutFlow.howDidYouHearAboutUs, form.data.howDidYouHearAboutUs);

        exportCheckoutFlowDataToActiveCampaign(
            (response, error, success) => {
                logger.print("Active Campaign");
                window.location.href = "/checkout-landline/checkout-step";
            }
        );
    });

    handleFormDataChange();

    const productIdentifiers = Store.local.read(
        Store.keys.checkoutFlow.selectedProductIdentifiers
    );
    updateOrderSummaryColumn(
        productIdentifiers
    );
});
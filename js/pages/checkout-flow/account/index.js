redirectToPreviousCheckoutFlowStepIfNeeded();

var recaptchaCallback = () => {};

const PageSettings = Object.freeze({
    useCaptcha: false
});

const onReady = () => {
    console.log(`On ready`);
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
            howDidYouHearAboutUs: "",
            isCaptchaValid: PageSettings.useCaptcha ? RecaptchaManager.getDefault().isValid() : false
        }
    };

    const handleFormDataChange = () => {
        const isCaptchAccepted = PageSettings.useCaptcha ? form.data.isCaptchaValid : true;
        const isFormValid = form.data.firstName.length
            && form.data.lastName.length
            && form.data.phone.length
            && form.data.email.length
            && form.data.howDidYouHearAboutUs.length
            && isCaptchAccepted;
        UserInterface.setElementEnabled(
            form.elements.submitButton,
            isFormValid
        );
        console.log(form.data);
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
        handleFormDataChange();
    };
    form.elements.howDidYouHearAboutUs.value = (() => {
        const valueFromStore = Store.local.read(
            Store.keys.checkoutFlow.howDidYouHearAboutUs
        ) ?? "";
        return valueFromStore.length ? valueFromStore : howDidYouHearAboutUsPlaceholder;
    })();
    form.data.howDidYouHearAboutUs = Store.local.read(
        Store.keys.checkoutFlow.howDidYouHearAboutUs
    ) ?? "";

    if (PageSettings.useCaptcha) {
        RecaptchaManager.getDefault().startObserving((isCaptchaValid) => {
            form.data.isCaptchaValid = isCaptchaValid;
            handleFormDataChange();
        });
    }

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
                console.log("Active Campaign");
                window.location.href = "/checkout-landline/checkout-step";
            }
        );
    });

    handleFormDataChange();

    const productIdentifiers = Store.local.read(
        Store.keys.checkoutFlow.selectedProductIdentifiers
    );
    
    if (router.isTestEnvironment()) {
        const orderSummaryPanel = new OrderSummaryPanel(
            document.querySelectorAll(".right-panel")[0]
        );

        const billingAddress = (() => {
            if (router.isTestEnvironment) {
                return new ProductCartBillingAddress(
                    "New York",
                    "NY",
                    "10008"
                );
            } else {
                return new ProductCartBillingAddress(
                    Store.local.read(
                        Store.keys.checkoutFlow.shippingAddress_city
                    ) ?? "",
                    Store.local.read(
                        Store.keys.checkoutFlow.shippingAddress_state
                    ) ?? "",
                    Store.local.read(
                        Store.keys.checkoutFlow.shippingAddress_zip
                    ) ?? ""
                );
            }
        })();

        const productCart = new ProductCart();
        productCart.setBillingAddress(
            billingAddress
        );
        productIdentifiers.forEach(productId => {
            productCart.addProductIdentifier(
                productId
            );
        });

        const productStore = ProductStore.getDefault();
        productStore.loadProducts((error) => {
            productCart.updatePrices((error) => {
                orderSummaryPanel.update(
                    productStore,
                    productCart
                );
            });
        });
    } else {
        updateOrderSummaryColumn(
            productIdentifiers
        );
    }
};

onReady();
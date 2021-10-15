// redirectToPreviousCheckoutFlowStepIfNeeded();

var recaptchaCallback = () => { };

const PageSettings = Object.freeze({
    useCaptcha: false
});

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

/**
 * @param {() => void} callback 
 */
const sendDataToAbandonedCartAPI = (callback) => {
    const session = CheckoutSession.getCurrent();
    const data = new CheckoutSessionDataMaker().stepThree(
        form.data.firstName,
        form.data.lastName,
        form.data.phone,
        form.data.email,
        form.data.howDidYouHearAboutUs
    );
    session.stopLastUpdateRequest();
    session.update(data, error => {
        if (callback) {
            callback();
        }
    });
};

const handleFormDataChange = () => {
    const isCaptchAccepted = PageSettings.useCaptcha ? form.data.isCaptchaValid : true;
    const isFormValid = form.data.firstName.length > 0
        && form.data.lastName.length > 0
        && form.data.phone.length > 0
        && new EmailValidator().check(form.data.email)
        && form.data.howDidYouHearAboutUs.length > 0
        && isCaptchAccepted;
    UserInterface.setElementEnabled(
        form.elements.submitButton,
        isFormValid
    );
    console.log(form.data);

    sendDataToAbandonedCartAPI(() => {
    });
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
UserInterface.forbidSpaceKeyForInput(
    form.elements.emailTextField
);
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
            router.open(
                router.getParameterValue("test-animation") != undefined ? "checkout-v2/checkout-step-2" : RouterPath.checkout_v2_checkoutStep,
                router.getParameters(),
                router.isTestEnvironment()
            );
        }
    );
});

findAndUpdateOrderSummaryPanel();

$(document).ready(() => {
    handleFormDataChange();
});
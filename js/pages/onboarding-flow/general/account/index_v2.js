const state = {
    email: "",
    servicePhoneNumber: "",
    firstName: "",
    lastName: "",
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    zip: "",
    state: "AL"
};

const ui = {
    submitButton: document.getElementById("submit-button")
};

const clearOnboardingFlowSettings = () => {
    Store.local.write(
        Store.keys.onboardingFlow.didSetupCallerId,
        false
    );
    Store.local.write(
        Store.keys.onboardingFlow.didSetupVoicemail,
        false
    );
    Store.local.write(
        Store.keys.onboardingFlow.didShowConfetti,
        false
    );
};

const isPortingActivated = router.getParameterValue(
    RouterPathParameter.portingActivated
) == 1;

const isNewNumberActivated = router.getParameterValue(
    RouterPathParameter.newNumberActivated
) == 1;

const setupUI = () => {
    document.getElementById("email-input").oninput = (event) => {
        state.email = event.currentTarget.value;
        handleStateChanges();
    };

    document.getElementById("service-phone-number-input").oninput = (event) => {
        state.servicePhoneNumber = event.currentTarget.value;
        handleStateChanges();
    };

    document.getElementById("first-name-input").oninput = (event) => {
        state.firstName = event.currentTarget.value;
        handleStateChanges();
    };

    document.getElementById("last-name-input").oninput = (event) => {
        state.lastName = event.currentTarget.value;
        handleStateChanges();
    };

    document.getElementById("address-line-one-input").oninput = (event) => {
        state.addressLineOne = event.currentTarget.value;
        handleStateChanges();
    };

    document.getElementById("address-line-two-input").oninput = (event) => {
        state.addressLineTwo = event.currentTarget.value;
        handleStateChanges();
    };

    document.getElementById("city-input").oninput = (event) => {
        state.city = event.currentTarget.value;
        handleStateChanges();
    };

    document.getElementById("zip-input").oninput = (event) => {
        state.zip = event.currentTarget.value;
        handleStateChanges();
    };

    document.getElementById("state-select").oninput = (event) => {
        state.state = event.currentTarget.value;
        handleStateChanges();
    };

    $(ui.submitButton).on("click", (event) => {
        event.preventDefault();

        if (isFormCorrect()) {
            submitForm();
        }
    });
};

/**
 * @param {boolean} enabled 
 */
const setSubmitButtonEnabled = (enabled) => {
    UserInterface.setElementEnabled(
        ui.submitButton,
        enabled
    );
}

const isFormCorrect = () => {
    return new EmailValidator().check(state.email)
        && state.firstName.length > 0
        && state.lastName.length > 0
        && state.addressLineOne.length > 0
        && state.city.length > 0
        && state.zip.length > 0;
}

const submitForm = () => {
    const currentTimestamp = Date.now();
    clearOnboardingFlowSettings();
    Store.local.write(
        Store.keys.onboardingFlow.email,
        email
    );
    Store.local.write(
        Store.keys.onboardingFlow.firstVisitTimestamp,
        email
    );
    GoogleDocIntegration.addLineToOnboarding({
        email: email,
        portingDataSent: false,
        callerIdSent: false,
        voicemailSent: false,
        firstVisitTimestamp: currentTimestamp,
        lastVisitTimestamp: currentTimestamp
    }, (response, error, success) => {
        if (isPortingActivated || isNewNumberActivated) {
            router.open(
                RouterPath.onboarding_onboarding_step_1,
                router.getParameters()
            );
        } else {
            router.open(
                RouterPath.onboarding_general_numberType,
                router.getParameters()
            );
        }
    });
};

const handleStateChanges = () => {
    setSubmitButtonEnabled(
        isFormCorrect()
    );
};

setupUI();
handleStateChanges();

const state = {
    email: "",
    servicePhoneNumber: "",
    firstName: "",
    lastName: "",
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    zip: "",
    stateCode: "AL"
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
        state.stateCode = event.currentTarget.value;
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
    saveFormToLocalStorage();
    GoogleDocIntegration.addLineToOnboarding({
        email: state.email,
        firstName: state.firstName,
        lastName: state.lastName,
        addressLineOne: state.addressLineOne,
        addressLineTwo: state.addressLineTwo,
        city: state.city,
        zip: state.zip,
        state: state.stateCode,
        servicePhoneNumber: state.servicePhoneNumber,
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

const saveFormToLocalStorage = () => {
    Store.local.write(
        Store.keys.onboardingFlow.email,
        state.email
    );
    Store.local.write(
        Store.keys.onboardingFlow.firstName,
        state.firstName
    );
    Store.local.write(
        Store.keys.onboardingFlow.lastName,
        state.lastName
    );
    Store.local.write(
        Store.keys.onboardingFlow.addressLineOne,
        state.addressLineOne
    );
    Store.local.write(
        Store.keys.onboardingFlow.addressLineTwo,
        state.addressLineTwo
    );
    Store.local.write(
        Store.keys.onboardingFlow.city,
        state.city
    );
    Store.local.write(
        Store.keys.onboardingFlow.zip,
        state.zip
    );
    Store.local.write(
        Store.keys.onboardingFlow.stateCode,
        state.stateCode
    );
    Store.local.write(
        Store.keys.onboardingFlow.firstVisitTimestamp,
        state.email
    );
};

const handleStateChanges = () => {
    setSubmitButtonEnabled(
        isFormCorrect()
    );
};

setupUI();
handleStateChanges();

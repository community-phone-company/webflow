const elements = Object.freeze({
    firstNameInput: document.getElementById("request-form__first-name-input"),
    lastNameInput: document.getElementById("request-form__last-name-input"),
    emailInput: document.getElementById("request-form__email-input"),
    phoneNumberInput: document.getElementById("request-form__phone-number-input"),
    additionalInformationInput: document.getElementById("request-form__additional-information-input"),
    submitButton: document.getElementById("request-form__submit-button")
})

const state = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    additionalInformation: ""
}

const isFormCompleted = () => {
    const requirements = [
        state.firstName.length > 0 || state.lastName.length > 0,
        state.email.length > 0 || state.phoneNumber.length > 0
    ];
    return !requirements.includes(false);
}

const updateUI = () => {
    UserInterface.setElementEnabled(
        elements.submitButton,
        isFormCompleted()
    );
}

const setupRequestForm = () => {
    elements.firstNameInput.oninput = () => {
        state.firstName = elements.firstNameInput.value;
        updateUI();
    }

    elements.lastNameInput.oninput = () => {
        state.lastName = elements.lastNameInput.value;
        updateUI();
    }

    elements.emailInput.oninput = () => {
        state.email = elements.emailInput.value;
        updateUI();
    }

    elements.phoneNumberInput.oninput = () => {
        state.phoneNumber = elements.phoneNumberInput.value;
        updateUI();
    }

    elements.additionalInformationInput.oninput = () => {
        state.additionalInformation = elements.additionalInformationInput.value;
        updateUI();
    }

    $(elements.submitButton).on("click", (event) => {
        if (isFormCompleted()) {
            GoogleDocIntegration.addLineToDemoRequest(
                {
                    ...state
                },
                () => {
                }
            );
        }
    })
}

$(document).ready(() => {
    setupRequestForm();
    updateUI();
})

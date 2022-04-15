/**
 * @param {HTMLElement} container 
 */
const useForm = (container) => {
    const elements = Object.freeze({
        firstNameInput: container.querySelectorAll(".request-form__first-name-input")[0],
        lastNameInput: container.querySelectorAll(".request-form__last-name-input")[0],
        emailInput: container.querySelectorAll(".request-form__email-input")[0],
        phoneNumberInput: container.querySelectorAll(".request-form__phone-number-input")[0],
        additionalInformationInput: container.querySelectorAll(".request-form__additional-information-input")[0],
        submitButton: container.querySelectorAll(".request-form__submit-button")[0]
    })
    console.log(elements);
    
    const state = {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        additionalInformation: ""
    }
    
    const isFormCompleted = () => {
        const requirements = [
            state.firstName.length > 0,
            state.email.length > 0,
            state.phoneNumber.length > 0
        ];
        return !requirements.includes(false);
    }
    
    const updateUI = () => {
        /*UserInterface.setElementEnabled(
            elements.submitButton,
            isFormCompleted()
        );*/
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

    setupRequestForm();
    updateUI();
}

$(document).ready(() => {
    //setupRequestForm();
    //updateUI();

    useForm(
        document.getElementById(
            "top-request-demo-form"
        )
    );
    useForm(
        document.getElementById(
            "bottom-request-demo-form"
        )
    );
})

const page = {
    elements: {
        form: document.querySelectorAll("#wf-form-service-address")[0],
        emailInput: document.querySelectorAll("#email-input")[0],
        submitButton: document.querySelectorAll("#submit-button")[0]
    },
    data: {
        email: ""
    }
};

const handleDataChange = () => {
    const isFormValid = new EmailValidator().check(page.data.email);
    console.log(`is form valid: ${isFormValid}`);
    UserInterface.setElementEnabled(
        page.elements.submitButton,
        isFormValid
    );
};

const submitForm = () => {
    const email = page.data.email;
    Store.local.write(
        Store.keys.checkoutFlow.email,
        email
    );
    
    router.open(
        RouterPath.landlineService,
        router.getParameters(),
        router.isTestEnvironment()
    );
};

const setupUI = () => {
    $(page.elements.form).submit((event) => {
        event.preventDefault();
        submitForm();
        return false;
    });

    UserInterface.forbidSpaceKeyForInput(
        page.elements.emailInput
    );

    handleDataChange();
};

$(document).ready(() => {
    setupUI();
});
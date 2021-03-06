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

/**
 * @param {() => void} callback 
 */
const sendDataToAbandonedCartAPI = (callback) => {
    const session = CheckoutSession.getCurrent();
    const data = new CheckoutSessionDataMaker().step_learnMore(
        page.data.email
    );
    session.stopLastUpdateRequest();
    session.update(data, error => {
        if (callback) {
            callback();
        }
    });
};

const isFormValid = () => {
    const requirements = [
        new EmailValidator().check(page.data.email)
    ];
    return !requirements.includes(false);
};

const handleDataChange = () => {
    UserInterface.setElementEnabled(
        page.elements.submitButton,
        isFormValid()
    );

    sendDataToAbandonedCartAPI(() => {
    });
};

const submitForm = () => {
    const email = page.data.email;
    Store.local.write(
        Store.keys.checkoutFlow.email,
        email
    );

    ActiveCampaignIntegration.createOrUpdateContact(
        new ActiveCampaignContact(
            email,
            "",
            "",
            "",
            []
        ),
        ActiveCampaignList.landlineCheckCoverage(),
        (response, error, success) => {
            router.open(
                RouterPath.checkCoverage_coverage,
                router.getParameters(),
                router.isTestEnvironment()
            );
        }
    );
};

const setupUI = () => {
    $(page.elements.form).submit((event) => {
        event.preventDefault();
        
        if (isFormValid()) {
            submitForm();
        }

        return false;
    });

    new InputValueObserver(page.elements.emailInput).startObserving(newValue => {
        page.data.email = newValue;
        handleDataChange();
    });
    UserInterface.forbidSpaceKeyForInput(
        page.elements.emailInput
    );

    handleDataChange();
};

$(document).ready(() => {
    setupUI();
});
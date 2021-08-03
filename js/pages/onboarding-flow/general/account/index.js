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

$(document).ready(() => {

    const formData = {
        email: ""
    };

    const handleFormChange = () => {
        logger.print(`Form has changed`);
        UserInterface.setElementEnabled(
            submitButton,
            new EmailValidator().check(formData.email)
        );
    };
    
    const submitButton = document.getElementById("submit-button");
    
    const emailTextField = document.getElementById("email");
    new InputValueObserver(emailTextField).startObserving((newValue) => {
        formData.email = newValue;
        handleFormChange();
    });

    const form = document.getElementById("wf-form-onboarding-flow");
    $(form).submit((event) => {
        event.preventDefault();
        const email = $(emailTextField).val();
        
        if (email.length) {
            clearOnboardingFlowSettings();
            Store.local.write(
                Store.keys.onboardingFlow.email,
                email
            );
            GoogleDocIntegration.addLineToOnboarding(
                email,
                undefined,
                false,
                undefined,
                undefined,
                false,
                false,
                (response, error, success) => {
                    window.location.href = $(submitButton).attr("href");
                }
            );
        } else {
            UserInterface.setElementEnabled(
                submitButton,
                false
            );
        }
    });
    
    $(submitButton).on("click", (event) => {
        event.preventDefault();
        form.submit();
    });

    handleFormChange();
});
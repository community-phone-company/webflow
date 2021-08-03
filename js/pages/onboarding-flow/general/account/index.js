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
            formData.email.length
        );
    };
    
    const submitButton = document.getElementById("submit-button");
    
    const emailTextField = document.getElementById("email");
    new InputValueObserver(emailTextField).startObserving((newValue) => {
        formData.email = newValue;
        handleFormChange();
    });
    
    $(submitButton).on("click", (event) => {
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

    handleFormChange();
});
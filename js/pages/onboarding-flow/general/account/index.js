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
) != undefined;

const isNewNumberActivated = router.getParameterValue(
    RouterPathParameter.newNumberActivated
) != undefined;

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

    const submitFormData = () => {
        logger.print(`Submit form data`);

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
                    if (isPortingActivated || isNewNumberActivated) {
                        router.open(
                            RouterPath.onboarding_onboarding_step_1,
                            router.getParameters()
                        );
                    } else {
                        router.open(
                            RouterPath.onboarding_general_numberType
                        );
                    }
                }
            );
        } else {
            UserInterface.setElementEnabled(
                submitButton,
                false
            );
        }
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
        submitFormData();
    });
    
    $(submitButton).on("click", (event) => {
        event.preventDefault();
        submitFormData();
    });

    handleFormChange();
});
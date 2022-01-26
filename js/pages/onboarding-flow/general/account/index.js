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

$(document).ready(() => {

    const formData = {
        email: ""
    };

    const handleFormChange = () => {
        console.log(`Form has changed`);
        UserInterface.setElementEnabled(
            submitButton,
            new EmailValidator().check(formData.email)
        );
    };

    const submitFormData = () => {
        console.log(`Submit form data`);

        const email = $(emailTextField).val();
        const isEmailValid = new EmailValidator().check(email);
        
        if (isEmailValid) {
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

    const form = document.getElementById("form-onboarding-flow");
    UserInterface.makeFormUnsubmittable(
        form
    );
    
    $(submitButton).on("click", (event) => {
        event.preventDefault();
        submitFormData();
    });

    handleFormChange();
});
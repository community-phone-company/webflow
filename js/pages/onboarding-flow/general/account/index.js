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
    
    $("#submit-button").on("click", (event) => {
        event.preventDefault();
        const email = $("#email").val();
        
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
                    $("form").submit();
                }
            );
        } else {
            $("form").submit();
        }
    });
});
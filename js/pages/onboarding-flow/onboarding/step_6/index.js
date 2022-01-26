updateOnboardingStepStatistics(6);

$(document).ready(() => {
    
    $("#submit-button").on("click", (event) => {
        event.preventDefault();
        router.open(
            RouterPath.onboarding_onboarding_step_7,
            router.getParameters()
        );
    });
});
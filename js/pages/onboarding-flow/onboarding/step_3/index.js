updateOnboardingStepStatistics(3);

$(document).ready(() => {
    
    $("#submit-button").on("click", (event) => {
        event.preventDefault();
        router.open(
            RouterPath.onboarding_onboarding_step_4,
            router.getParameters()
        );
    });
});
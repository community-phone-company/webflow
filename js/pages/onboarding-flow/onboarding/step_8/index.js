updateOnboardingStepStatistics(8);

$(document).ready(() => {
    
    $("#submit-button").on("click", (event) => {
        event.preventDefault();
        router.open(
            RouterPath.onboarding_onboarding_setupService,
            router.getParameters()
        );
    });
});
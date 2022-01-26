updateOnboardingStepStatistics(7);

$(document).ready(() => {
    
    $("#test-call-did-work-button").on("click", (event) => {
        event.preventDefault();
        router.open(
            RouterPath.onboarding_onboarding_step_8,
            router.getParameters()
        );
    });

    $("#test-call-did-not-work-button").on("click", (event) => {
        event.preventDefault();
        router.open(
            RouterPath.onboarding_onboarding_testCallDidNotWork,
            router.getParameters()
        );
    });
});
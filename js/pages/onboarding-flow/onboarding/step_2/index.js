updateOnboardingStepStatistics(2);

$(document).ready(() => {

    $("#submit-button").on("click", (event) => {
        event.preventDefault();
        router.open(
            RouterPath.onboarding_onboarding_step_3,
            router.getParameters()
        );
    });
});
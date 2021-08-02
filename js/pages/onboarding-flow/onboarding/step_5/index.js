/**
 * @param {number} currentStep 
 */
const updateStepStatistics = (currentStep) => {
    const email = Store.local.read(
        Store.keys.onboardingFlow.email
    );

    if (!email) {
        return;
    }
    
    var furthestStep = Store.local.read(
        Store.keys.onboardingFlow.furthestStep
    ) ?? currentStep;

    if (furthestStep < currentStep) {
        furthestStep = currentStep;
    }

    Store.local.write(
        Store.keys.onboardingFlow.furthestStep,
        furthestStep
    );

    GoogleDocIntegration.addLineToOnboarding(
        email,
        undefined,
        undefined,
        currentStep,
        furthestStep,
        undefined,
        undefined,
        (response, error, success) => {
            $("form").submit();
        }
    );
};

updateStepStatistics(5);

$(document).ready(() => {
    
    $("#test-call-did-work-button").on("click", () => {
    });

    $("#test-call-did-not-work-button").on("click", () => {
    });
});
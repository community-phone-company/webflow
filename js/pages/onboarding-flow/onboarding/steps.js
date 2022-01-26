/**
 * @param {number} currentStep
 * @param {(() => void) | undefined} callback 
 */
const updateOnboardingStepStatistics = (
    currentStep,
    callback
) => {
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

    GoogleDocIntegration.addLineToOnboarding({
        email,
        currentStep,
        furthestStep,
        lastVisitTimestamp: Date.now()
    }, () => {
        if (callback) {
            callback();
        }
    });
};
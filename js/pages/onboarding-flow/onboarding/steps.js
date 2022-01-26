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

    const furthestStep = Math.max(
        Store.local.read(
            Store.keys.onboardingFlow.furthestStep
        ) ?? currentStep,
        currentStep
    );

    Store.local.write(
        Store.keys.onboardingFlow.furthestStep,
        furthestStep
    );

    const numberOfVisitsToCurrentStep = (() => {
        const fromStorage = Store.local.read(
            getLocalStorageKeyForNumberOfVisitsToStep(
                currentStep
            )
        ) ?? 0;
        return fromStorage + 1;
    })();
    Store.local.write(
        getLocalStorageKeyForNumberOfVisitsToStep(
            currentStep
        ),
        numberOfVisitsToCurrentStep
    );

    GoogleDocIntegration.addLineToOnboarding({
        email,
        currentStep,
        furthestStep,
        lastVisitTimestamp: Date.now(),
        numberOfVisitsToStep: {
            [getJsonKeyForNumberOfVisitsStep(currentStep)]: numberOfVisitsToCurrentStep
        }
    }, callback);
};

const getLocalStorageKeyForNumberOfVisitsToStep = (step) => {
    switch (step) {
        case 1:
            return Store.keys.onboardingFlow.numberOfVisitsToStep_1;
        case 2:
            return Store.keys.onboardingFlow.numberOfVisitsToStep_2;
        case 3:
            return Store.keys.onboardingFlow.numberOfVisitsToStep_3;
        case 4:
            return Store.keys.onboardingFlow.numberOfVisitsToStep_4;
        case 5:
            return Store.keys.onboardingFlow.numberOfVisitsToStep_5;
        case 6:
            return Store.keys.onboardingFlow.numberOfVisitsToStep_6;
        case 7:
            return Store.keys.onboardingFlow.numberOfVisitsToStep_7;
        case 8:
            return Store.keys.onboardingFlow.numberOfVisitsToStep_8;
        default:
            return "";
    }
}

const getJsonKeyForNumberOfVisitsStep = (step) => {
    switch (step) {
        case 1:
            return "step_1";
        case 2:
            return "step_2";
        case 3:
            return "step_3";
        case 4:
            return "step_4";
        case 5:
            return "step_5";
        case 6:
            return "step_6";
        case 7:
            return "step_7";
        case 8:
            return "step_8";
        default:
            return "";
    }
}
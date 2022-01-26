$(document).ready(() => {

    const form = document.getElementById("email-form");
    const numberOfCallsInput = document.getElementById("number-of-rings");
    const submitButton = document.getElementById("submit-button");

    const handleFormChange = () => {
        UserInterface.setElementEnabled(
            submitButton,
            numberOfCallsInput.value.length
        );
    };

    new InputValueObserver(numberOfCallsInput).startObserving((newValue) => {
        handleFormChange();
    });

    $(submitButton).on("click", (event) => {
        event.preventDefault();

        const numberOfCalls = numberOfCallsInput.valueAsNumber;
        const email = Store.local.read(
            Store.keys.onboardingFlow.email
        );

        if (numberOfCalls) {
            const data = {
                "number_of_calls": numberOfCalls,
                "email": email
            };

            /**
             * Send data to Zendesk.
             */
            ZendeskIntegration.createTicketForVoicemail(
                data,
                (response, error, success) => {
                    
                    /**
                     * Send data to Google Sheets.
                     */
                     GoogleDocIntegration.addLineToOnboarding({
                        email,
                        lastVisitTimestamp: Date.now(),
                        voicemailSent: true
                    }, (response, error, success) => {
                        /**
                             * Redirect to the next page.
                             */
                         const didSetup = {
                            callerId: Store.local.read(
                                Store.keys.onboardingFlow.didSetupCallerId
                            ),
                            voicemail: true
                        };
                        const didSetupEverything = didSetup.callerId && didSetup.voicemail;
                        window.location.href = didSetupEverything
                            ? "/onboarding/onboarding/thank-you-for-onboarding"
                            : "/onboarding/onboarding/set-up-service";
                    });
                }
            );
            Store.local.write(
                Store.keys.onboardingFlow.didSetupVoicemail,
                true
            );
        } else {
            UserInterface.setElementEnabled(
                submitButton,
                false
            );
        }
    });

    handleFormChange();
});
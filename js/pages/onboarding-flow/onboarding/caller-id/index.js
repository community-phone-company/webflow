$(document).ready(() => {

    const form = document.getElementById("email-form");
    const callerIdInput = document.getElementById("name");
    const submitButton = document.getElementById("submit-button");

    const handleFormChange = () => {
        UserInterface.setElementEnabled(
            submitButton,
            callerIdInput.value.length
        );
    };

    new InputValueObserver(callerIdInput).startObserving((newValue) => {
        handleFormChange();
    });

    $("#submit-button").on("click", (event) => {
        event.preventDefault();

        const callerId = callerIdInput.value;
        const email = Store.local.read(
            Store.keys.onboardingFlow.email
        );

        if (callerId) {
            const data = {
                "caller_id": callerId,
                "email": Store.local.read(
                    Store.keys.onboardingFlow.email
                )
            };

            /**
             * Send data to Zendesk.
             */
            ZendeskIntegration.createTicketForCallerId(
                data,
                (response, error, success) => {
                    
                    /**
                     * Send data to Google Sheets.
                     */
                    GoogleDocIntegration.addLineToOnboarding(
                        email,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        true,
                        undefined,
                        (response, error, success) => {
                            
                            /**
                             * Redirect to the right page.
                             */
                            const didSetup = {
                                callerId: true,
                                voicemail: Store.local.read(
                                    Store.keys.onboardingFlow.didSetupVoicemail
                                )
                            };
                            const didSetupEverything = didSetup.callerId && didSetup.voicemail;
                            window.location.href = didSetupEverything
                                ? "/onboarding/onboarding/thank-you-for-onboarding"
                                : "/onboarding/onboarding/set-up-service";
                        }
                    )
                }
            );
            Store.local.write(
                Store.keys.onboardingFlow.callerId,
                callerId
            );
            Store.local.write(
                Store.keys.onboardingFlow.didSetupCallerId,
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
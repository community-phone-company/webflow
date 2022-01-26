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
                    GoogleDocIntegration.addLineToOnboarding({
                        email: email,
                        callerIdSent: true,
                        lastVisitTimestamp: Date.now()
                    }, (response, error, success) => {

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
                        router.open(
                            didSetupEverything
                                ? RouterPath.onboarding_onboarding_thankYou
                                : RouterPath.onboarding_onboarding_setupService,
                            router.getParameters()
                        );
                    });
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
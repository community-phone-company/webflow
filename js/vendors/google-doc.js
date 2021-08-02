class GoogleDocIntegration {

    /**
     * Adds new line to the service address check document.
     * @param {string} address Address.
     * @param {string} city City.
     * @param {string} state State.
     * @param {string} zip Zip code.
     * @param {boolean} isBusiness Defines, whether the client is a company.
     * @param {((response: any, error: any, success: boolean) => void) | undefined} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    static addLineToServiceAddressCheck = (
        address,
        city,
        state,
        zip,
        isBusiness,
        callback
    ) => {
        const data = {
            "Address": address,
            "City": city,
            "State": state,
            "Zip code": zip,
            "Is business": isBusiness ? "yes" : "no"
        };
        logger.print(`Data: `, data);
        return ZapierIntegration.sendToWebhook(
            "https://hooks.zapier.com/hooks/catch/10558854/b208t38/",
            data,
            callback
        );
    }

    /**
     * Adds new line to the onboarding document.
     * @param {string} email Email.
     * @param {string | undefined} currentCarrier Current carrier.
     * @param {boolean | undefined} portingDataSent Defines whether porting form was submitted.
     * @param {string | undefined} currentStepInOnboarding Current step on onboarding flow.
     * @param {number | undefined} furthestStepInOnboarding Furthest step on onboarding flow.
     * @param {boolean | undefined} callerIdSent Defines whether caller ID form was submitted.
     * @param {boolean | undefined} voicemailSent Defines whether voicemail form was submitted.
     * @param {((response: any, error: any, success: boolean) => void) | undefined} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    static addLineToOnboarding = (
        email,
        currentCarrier,
        portingDataSent,
        currentStepInOnboarding,
        furthestStepInOnboarding,
        callerIdSent,
        voicemailSent,
        callback
    ) => {
        var data = {};
        data["Email address"] = email;
        if (currentCarrier != undefined) data["Current carrier"] = currentCarrier;
        if (portingDataSent != undefined) data["Porting data sent"] = portingDataSent ? "yes" : "no";
        if (currentStepInOnboarding != undefined) data["Current step in onboarding"] = currentStepInOnboarding;
        if (furthestStepInOnboarding != undefined) data["Furthest step in onboarding"] = furthestStepInOnboarding;
        if (callerIdSent != undefined) data["Caller ID sent"] = callerIdSent ? "yes" : "no";
        if (voicemailSent != undefined) data["Voicemail sent"] = voicemailSent ? "yes" : "no";

        logger.print(`Data: `, data);
        return ZapierIntegration.sendToWebhook(
            "https://hooks.zapier.com/hooks/catch/10558854/b2774te/",
            data,
            callback
        );
    }
}
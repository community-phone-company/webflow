class GoogleDocIntegration {

    /**
     * Adds new line to the service address check document.
     * @param {string} addressLineOne Address line one.
     * @param {string} addressLineTwo Address line two.
     * @param {string} city City.
     * @param {string} state State.
     * @param {string} zip Zip code.
     * @param {boolean} isBusiness Defines, whether the client is a company.
     * @param {string} email Email.
     * @param {string} userId User identifier.
     * @param {boolean} sendToLobCom Defines, whether to send the information to Lob.com service.
     * @param {((response: any, error: any, success: boolean) => void) | undefined} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    static addLineToServiceAddressCheck = (
        addressLineOne,
        addressLineTwo,
        city,
        state,
        zip,
        isBusiness,
        email,
        userId,
        sendToLobCom,
        callback
    ) => {
        const data = {
            "Address": addressLineOne,
            "Address line two": addressLineTwo,
            "City": city,
            "State": state,
            "Zip code": zip,
            "Is business": isBusiness ? "yes" : "no",
            "Email": email,
            "User ID": userId
        };
        console.log(`Data: `, data);
        const urls = {
            simpleZap: "https://hooks.zapier.com/hooks/catch/10558854/b208t38/",
            lobComIntegration: "https://hooks.zapier.com/hooks/catch/10210393/b6htb82/"
        };
        return ZapierIntegration.sendToWebhook(
            sendToLobCom ? urls.lobComIntegration : urls.simpleZap,
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
    static ____addLineToOnboarding = (
        email,
        currentCarrier,
        portingDataSent,
        currentStepInOnboarding,
        furthestStepInOnboarding,
        callerIdSent,
        voicemailSent,
        firstVisitTimestamp,
        lastVisitTimestamp,
        numberOfVisits,
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

        console.log(`Data: `, data);
        return ZapierIntegration.sendToWebhook(
            "https://hooks.zapier.com/hooks/catch/10558854/b2774te/",
            data,
            callback
        );
    }

    /**
     * Adds new line to the onboarding document.
     * @param {
            {
                email: string,
                currentCarrier: string | undefined,
                portingDataSent: string | undefined,
                currentStep: number | undefined,
                furthestStep: number | undefined,
                callerIdSent: boolean | undefined,
                voicemailSent: boolean | undefined,
                firstVisitTimestamp: number | undefined,
                lastVisitTimestamp: number | undefined,
                numberOfVisits: number | undefined
            }
        } settings
     *  
     * @param {((response: any, error: any, success: boolean) => void) | undefined} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    static addLineToOnboarding = (
        settings,
        callback
    ) => {
        var data = {};
        data["Email address"] = settings.email;
        if (settings.currentCarrier != undefined) data["Current carrier"] = settings.currentCarrier;
        if (settings.portingDataSent != undefined) data["Porting data sent"] = settings.portingDataSent ? "yes" : "no";
        if (settings.currentStepInOnboarding != undefined) data["Current step in onboarding"] = settings.currentStep;
        if (settings.furthestStep != undefined) data["Furthest step in onboarding"] = settings.furthestStep;
        if (settings.callerIdSent != undefined) data["Caller ID sent"] = settings.callerIdSent ? "yes" : "no";
        if (settings.voicemailSent != undefined) data["Voicemail sent"] = settings.voicemailSent ? "yes" : "no";
        if (settings.firstVisitTimestamp) data["First visit date"] = getFormattedDateAndTimeForBoston(settings.firstVisitTimestamp);
        if (settings.lastVisitTimestamp) data["Last visit date"] = getFormattedDateAndTimeForBoston(settings.lastVisitTimestamp);
        if (settings.numberOfVisits) data["Number of visits"] =  settings.numberOfVisits;

        return ZapierIntegration.sendToWebhook(
            "https://hooks.zapier.com/hooks/catch/10558854/b2774te/",
            data,
            callback
        );
    }
}

/**
 * @param {number} timestamp 
 * @param {number} timezone 
 * @param {string} locale 
 * @returns {string}
 */
const getFormattedDateAndTime = (timestamp, timezone, locale) => {
    var date = new Date(timestamp);
    date = new Date(timestamp + (date.getTimezoneOffset() + timezone * 60) * 60000);
    return date.toLocaleString(locale);
};

/**
 * @param {number} timestamp 
 * @returns {string}
 */
const getFormattedDateAndTimeForBoston = (timestamp) => {
    return getFormattedDateAndTime(
        timestamp,
        -5,
        "en-US"
    );
};
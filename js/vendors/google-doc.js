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
     * @param {
            {
                firstName: string,
                lastName: string,
                email: string,
                phoneNumber: string,
                additionalInformation: string
            }
        } data 
     * @param {() => void} callback 
     * @returns {XMLHttpRequest | undefined}
     */
    static addLineToDemoRequest = (
        settings,
        callback
    ) => {
        const data = {
            "First name": settings.firstName,
            "Last name": settings.lastName,
            "Email": settings.email,
            "Phone number": settings.phoneNumber,
            "Additional information": settings.additionalInformation
        };
        console.log(`Data: `, data);
        const zap = {
            gmail: "https://hooks.zapier.com/hooks/catch/10558854/b8iw4gd/",
            activeCampaign: "https://hooks.zapier.com/hooks/catch/10558854/bzrw11j/"
        };
        return ZapierIntegration.sendToWebhook(
            zap.activeCampaign,
            data,
            callback
        );
    }

    /**
     * Adds new line to the onboarding document.
     * @param {
            {
                email: string,
                firstName: string,
                lastName: string,
                servicePhoneNumber: string,
                addressLineOne: string,
                addressLineTwo: string,
                city: string,
                zip: string,
                state: string,
                currentCarrier: string | undefined,
                portingDataSent: boolean | undefined,
                currentStep: number | undefined,
                furthestStep: number | undefined,
                callerIdSent: boolean | undefined,
                voicemailSent: boolean | undefined,
                firstVisitTimestamp: number | undefined,
                lastVisitTimestamp: number | undefined,
                totalNumberOfVisits: number | undefined,
                numberOfVisitsToStep: {
                    step_1: number | undefined,
                    step_2: number | undefined,
                    step_3: number | undefined,
                    step_4: number | undefined,
                    step_5: number | undefined,
                    step_6: number | undefined,
                    step_7: number | undefined,
                    step_8: number | undefined,
                } | undefined,
                troubleshootingLinkClickCount: number | undefined
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
        if (settings.firstName != undefined) data["First name"] = settings.firstName;
        if (settings.lastName != undefined) data["Last name"] = settings.lastName;
        if (settings.servicePhoneNumber != undefined) data["Service phone number"] = settings.servicePhoneNumber;
        if (settings.currentCarrier != undefined) data["Current carrier"] = settings.currentCarrier;
        if (settings.portingDataSent != undefined) data["Porting data sent"] = settings.portingDataSent ? "yes" : "no";
        if (settings.currentStep != undefined) data["Current step in onboarding"] = settings.currentStep;
        if (settings.furthestStep != undefined) data["Furthest step in onboarding"] = settings.furthestStep;
        if (settings.callerIdSent != undefined) data["Caller ID sent"] = settings.callerIdSent ? "yes" : "no";
        if (settings.voicemailSent != undefined) data["Voicemail sent"] = settings.voicemailSent ? "yes" : "no";
        if (settings.firstVisitTimestamp) data["First visit date"] = getFormattedDateAndTimeForBoston(settings.firstVisitTimestamp);
        if (settings.lastVisitTimestamp) data["Last visit date"] = getFormattedDateAndTimeForBoston(settings.lastVisitTimestamp);
        if (settings.totalNumberOfVisits) data["Number of visits"] =  settings.totalNumberOfVisits;
        
        if (settings.numberOfVisitsToStep) {
            if (settings.numberOfVisitsToStep.step_1) data["Step 1 views"] =  settings.numberOfVisitsToStep.step_1;
            if (settings.numberOfVisitsToStep.step_2) data["Step 2 views"] =  settings.numberOfVisitsToStep.step_2;
            if (settings.numberOfVisitsToStep.step_3) data["Step 3 views"] =  settings.numberOfVisitsToStep.step_3;
            if (settings.numberOfVisitsToStep.step_4) data["Step 4 views"] =  settings.numberOfVisitsToStep.step_4;
            if (settings.numberOfVisitsToStep.step_5) data["Step 5 views"] =  settings.numberOfVisitsToStep.step_5;
            if (settings.numberOfVisitsToStep.step_6) data["Step 6 views"] =  settings.numberOfVisitsToStep.step_6;
            if (settings.numberOfVisitsToStep.step_7) data["Step 7 views"] =  settings.numberOfVisitsToStep.step_7;
            if (settings.numberOfVisitsToStep.step_8) data["Step 8 views"] =  settings.numberOfVisitsToStep.step_8;
        }

        if (settings.troubleshootingLinkClickCount) data["Troubleshooting link click count"] = settings.troubleshootingLinkClickCount;

        return ZapierIntegration.sendToWebhook(
            //"https://hooks.zapier.com/hooks/catch/10558854/b2774te/",
            "https://hooks.zapier.com/hooks/catch/10210393/b2774te/",
            data,
            callback
        );
    }
}

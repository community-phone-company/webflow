class ZendeskIntegration {

    /**
     * Creates new ticket.
     * @param {any} data Plain JSON object containing fields.
     * @param {(response: any, error: any, success: boolean) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    static createTicketForNumberTransfer = (data, callback) => {
        return ZapierIntegration.sendToWebhook(
            "https://hooks.zapier.com/hooks/catch/7786634/b2nen7j/",
            data,
            callback
        );
    }

    /**
     * Creates new ticket.
     * @param {any} data Plain JSON object containing fields.
     * @param {(response: any, error: any, success: boolean) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    static createTicketForCallerId = (data, callback) => {
        return ZapierIntegration.sendToWebhook(
            "https://hooks.zapier.com/hooks/catch/7786634/b2negu7/",
            data,
            callback
        );
    }

    /**
     * Creates new ticket.
     * @param {any} data Plain JSON object containing fields.
     * @param {(response: any, error: any, success: boolean) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
     static createTicketForVoicemail = (data, callback) => {
        return ZapierIntegration.sendToWebhook(
            "https://hooks.zapier.com/hooks/catch/7786634/b2nepb3/",
            data,
            callback
        );
    }
}
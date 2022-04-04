class ZapierIntegration {

    /**
     * Sends request to Zapier webhook.
     * @param {string} url Webhook URL.
     * @param {any} data Plain JSON object containing fields.
     * @param {((response: any, error: any, success: boolean) => void) | undefined} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    static sendToWebhook = (url, data, callback) => {
        const filteredData = {
            "Request timestamp": getFormattedDateAndTimeForBoston(
                Date.now()
            ),
            ...data
        };
        return $.ajax({
            url: url,
            method: "POST",
            crossDomain: true,
            dataType: "json",
            data: filteredData,
            success: function (response) {
                console.log(response);

                if (callback) {
                    callback(
                        response,
                        undefined,
                        true
                    );
                }
            },
            error: function (error) {
                console.log(error);
                
                if (callback) {
                    callback(
                        undefined,
                        error,
                        false
                    );
                }
            }
        });
    }
}
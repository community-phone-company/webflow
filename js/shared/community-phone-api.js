class CommunityPhoneAPI {

    /**
     * Production API.
     */
    static production = new CommunityPhoneAPI(
        "production"
    );

    /**
     * Staging API.
     */
    static staging = new CommunityPhoneAPI(
        "staging"
    );

    static defaultVersion = "1";

    /**
     * Creates new {@link CommunityPhoneAPI} instance with production mode and latest API version.
     * @returns {CommunityPhoneAPI} Instance of {@link CommunityPhoneAPI} type.
     */
    static productionWithDefaultVersion = () => {
        return new CommunityPhoneAPI(
            "production",
            this.defaultVersion
        );
    }

    /**
     * Creates new {@link CommunityPhoneAPI} instance with staging mode and latest API version.
     * @returns {CommunityPhoneAPI} Instance of {@link CommunityPhoneAPI} type.
     */
    static stagingWithDefaultVersion = () => {
        return new CommunityPhoneAPI(
            "staging",
            this.defaultVersion
        );
    }

    /**
     * Checks {@link IS_PRODUCTION} value and creates new {@link CommunityPhoneAPI} instance
     * with appropriate mode and latest API version.
     * @returns {CommunityPhoneAPI} Instance of {@link CommunityPhoneAPI} type.
     */
    static currentEnvironmentWithDefaultVersion = () => {
        return new CommunityPhoneAPI(
            IS_PRODUCTION ? "production" : "staging",
            this.defaultVersion
        );
    }

    /**
     * Checks {@link IS_PRODUCTION} value and creates new {@link CommunityPhoneAPI} instance
     * with appropriate mode and API version from parameters.
     * @param {string} version API version.
     * @returns {CommunityPhoneAPI} Instance of {@link CommunityPhoneAPI} type.
     */
     static currentEnvironmentWithVersion = (version) => {
        return new CommunityPhoneAPI(
            IS_PRODUCTION ? "production" : "staging",
            version
        );
    }

    /**
     * @constructor
     * @param {"production" | "staging"} mode API mode.
     * @param {string} version API version name.
     */
    constructor(mode, version) {
        this.mode = mode;
        this.version = version;
    }

    /**
     * @returns {string} Base URL.
     */
    getBaseUrl = () => {
        switch (this.mode) {
            case "production":
                return `https://landline.phone.community/api/v${this.version}`;
            case "staging":
                return `https://staging-landline.phone.community/api/v${this.version}`;
        }
    }

    /**
     * @param {string} relativePath Endpoint's relative path. Example:
     * @returns {string} Absolute URL.
     */
    getAbsoluteUrl = (relativePath) => {
        var url = `${this.getBaseUrl()}/${relativePath}`;

        if (!url.endsWith("/")) {
            url += "/";
        }

        return url;
    }

    /**
     * @param {any} responseError 
     * @param {boolean | undefined} isHtml
     * @returns {string | undefined}
     */
    getErrorMessage = (responseError, isHtml) => {
        return responseError
            && responseError.responseJSON
            && (isHtml ? responseError.responseJSON.message_html : responseError.responseJSON.message);
    }

    /**
     * @param {string} endpoint 
     * @param {"GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "HEAD" | "PATCH" | "TRACE" | "CONNECT"} method
     * @param {any} headers
     * @param {any} data 
     * @param {(response: any, error: any) => void} callback 
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    jsonRequest = (endpoint, method, headers, data, callback) => {
        const url = this.getAbsoluteUrl(
            endpoint
        );
        
        [
            `Sending request`,
            `URL: ${url}`,
            `method: ${method}`,
            `headers:`,
            headers,
            `data:`,
            data
        ].forEach(value => console.log(value));

        const startTimestamp = Date.now();
        const measureDuration = (startTimestamp) => {
            const endTimestamp = Date.now();
            const duration = (endTimestamp - startTimestamp) / 1000;
            console.log(`Finished in ${duration} seconds`);
        };

        return $.ajax({
            url: url,
            method: method,
            headers: headers,
            dataType: "json",
            //data: data ? JSON.stringify(data) : undefined,
            data: data,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                measureDuration(startTimestamp);
                console.log(`Response from URL ${url}: `, response);
                callback(
                    response,
                    undefined
                );
            },
            error: function (error) {
                measureDuration(startTimestamp);
                console.log(`Error from URL ${url}: `, error);
                callback(
                    undefined,
                    error
                );
            }
        });
    }
}

CommunityPhoneAPI.endpoints = Object.freeze({
    auth_email: "auth/email",
    auth_token: "auth/token",
    portal_billing: "portal/billing",
    search_addresses: "search/addresses",
    search_numbers: "search/numbers",
    checkout_sessions: "checkout/sessions",
    checkout_sessions_id: (id) => {
        return `checkout/sessions/${id}`;
    },
    chargebee_checkout: "chargebee/checkout",
    chargebee_checkPaymentStatus: (subscriptionIdentifier) => {
        return `chargebee/${subscriptionIdentifier}/check-payment-status`;
    },
    tax_estimate: "billing/products/tax-estimate",
    internationalCalls_checkCallRates: "internationalcalls/check-call-rates",
    internationalCalls_getCallRatesRange: "internationalcalls/get-call-rates-range"
});
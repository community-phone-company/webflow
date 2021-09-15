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

    static latestVersion = "1";

    /**
     * Creates new {@link CommunityPhoneAPI} instance with production mode and latest API version.
     * @returns {CommunityPhoneAPI} Instance of {@link CommunityPhoneAPI} type.
     */
    static productionWithLatestVersion = () => {
        return new CommunityPhoneAPI(
            "production",
            this.latestVersion
        );
    }

    /**
     * Creates new {@link CommunityPhoneAPI} instance with staging mode and latest API version.
     * @returns {CommunityPhoneAPI} Instance of {@link CommunityPhoneAPI} type.
     */
    static stagingWithLatestVersion = () => {
        return new CommunityPhoneAPI(
            "staging",
            this.latestVersion
        );
    }

    /**
     * Checks {@link IS_PRODUCTION} value and creates new {@link CommunityPhoneAPI} instance
     * with appropriate mode and latest API version.
     * @returns {CommunityPhoneAPI} Instance of {@link CommunityPhoneAPI} type.
     */
    static currentEnvironmentWithLatestVersion = () => {
        return new CommunityPhoneAPI(
            IS_PRODUCTION ? "production" : "staging",
            this.latestVersion
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
     * @param {"GET" | "POST" | "PUT" | "UPDATE" | "OPTIONS" | "DELETE"} method
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

        return $.ajax({
            url: url,
            method: method,
            headers: headers,
            dataType: "json",
            data: data ? JSON.stringify(data) : undefined,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                console.log(`Response from URL ${url}: `, response);
                callback(
                    response,
                    undefined
                );
            },
            error: function (error) {
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
    chargebee_checkout: "chargebee/checkout"
});
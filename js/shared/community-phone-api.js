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

    static productionWithLatestVersion = () => {
        return new CommunityPhoneAPI(
            "production",
            this.latestVersion
        );
    }

    static stagingWithLatestVersion = () => {
        return new CommunityPhoneAPI(
            "staging",
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
     * @param {string} relativePath 
     * @param {"GET" | "POST" | "PUT" | "UPDATE" | "OPTIONS" | "DELETE"} method
     * @param {any} data 
     * @param {(response: any, error: any) => void} callback 
     */
    jsonRequest = (relativePath, method, data, callback) => {
        const url = this.getAbsoluteUrl(
            relativePath
        );
        $.ajax({
            url: url,
            method: method,
            data: data,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                callback(
                    response,
                    undefined
                );
            },
            error: function (error) {
                callback(
                    undefined,
                    error
                );
            }
        });
    }
}

CommunityPhoneAPI.endpoints = Object.freeze({
    auth_email: "auth/email"
});
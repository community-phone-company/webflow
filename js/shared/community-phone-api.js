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
                return ``;
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
}

CommunityPhoneAPI.endpoints = Object.freeze({
});
class UserPortalManager {

    static _default;

    /**
     * @returns {UserPortalManager}
     */
    static getDefault = () => {
        if (!this._default) {
            this._default = new UserPortalManager();
        }

        return this._default;
    }

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * @returns {HTMLElement | undefined}
     */
    getUserPortalLink = () => {
        return document.querySelectorAll(".user-portal-v1")[0];
    }

    /**
     * @returns {Popup}
     */
    getCreateAccountPopup = () => {
        return new Popup("#user-portal-login-popup");
    }

    /**
     * @param {string} email 
     * @param {(error: any, api: CommunityPhoneAPI) => void} callback 
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    requestAuthorizationCode = (email, callback) => {
        const api = CommunityPhoneAPI.currentEnvironmentWithLatestVersion();
        const data = {
            email: email
        };
        return api.jsonRequest(
            CommunityPhoneAPI.endpoints.auth_email,
            "POST",
            undefined,
            data,
            (response, error) => {
                callback(
                    error,
                    api
                );
            }
        );
    }

    /**
     * @param {string} code 
     * @param {string} email 
     * @param {(authorizationToken: string | undefined, error: any, api: CommunityPhoneAPI) => void} callback 
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    sendAuthorizationCode = (code, email, callback) => {
        const api = CommunityPhoneAPI.currentEnvironmentWithLatestVersion();
        const data = {
            token: code,
            email: email
        };
        return api.jsonRequest(
            CommunityPhoneAPI.endpoints.auth_token,
            "POST",
            undefined,
            data,
            (response, error) => {
                if (error) {
                    callback(
                        undefined,
                        error,
                        api
                    );
                } else {
                    const authorizationToken = response && response.token;
                    callback(
                        authorizationToken,
                        undefined,
                        api
                    );
                }
            }
        );
    }

    /**
     * @param {string} authorizationToken 
     * @param {(accessUrl: string | undefined, error: any, api: CommunityPhoneAPI) => void} callback 
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    getAccessUrl = (authorizationToken, callback) => {
        const api = CommunityPhoneAPI.currentEnvironmentWithLatestVersion();
        const headers = {
            "Authorization": authorizationToken
        };
        return api.jsonRequest(
            CommunityPhoneAPI.endpoints.auth_token,
            "POST",
            headers,
            undefined,
            (response, error) => {
                if (error) {
                    callback(
                        undefined,
                        error,
                        api
                    );
                } else {
                    const accessUrl = response && response.access_url;
                    callback(
                        accessUrl,
                        undefined,
                        api
                    );
                }
            }
        );
    }

    setup = () => {
        const popup = this.getCreateAccountPopup();
        $(this.getUserPortalLink()).on("click", (event) => {
            event.preventDefault();
            popup.show();
            console.log("Open user portal popup");
        });
    }
}
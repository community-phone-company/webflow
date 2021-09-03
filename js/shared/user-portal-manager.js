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
     * @returns {boolean}
     */
    static isSupported = () => {
        const hasLink = document.querySelectorAll(".user-portal-v1").length > 0;
        const hasPopup = document.querySelectorAll("#user-portal-login-popup").length > 0;
        return hasLink && hasPopup;
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
        const _this = this;

        const popup = this.getCreateAccountPopup();
        $(this.getUserPortalLink()).on("click", (event) => {
            event.preventDefault();
            popup.show();
        });

        const elements = {
            container: popup.getContainer(),
            steps: {
                one: {
                    container: popup.getContainer().querySelectorAll(".sign-up-step-1")[0],
                    emailInput: popup.getContainer().querySelectorAll(".sign-up-step-1 input.email-input")[0],
                    ctaButton: popup.getContainer().querySelectorAll(".sign-up-step-1 .popup-cta-button")[0]
                },
                two: {
                    container: popup.getContainer().querySelectorAll(".sign-up-step-2")[0],
                    codeInput: popup.getContainer().querySelectorAll(".sign-up-step-2 input.code-input")[0],
                    userEmail: popup.getContainer().querySelectorAll(".sign-up-step-1 .user-email-span")[0],
                    ctaButton: popup.getContainer().querySelectorAll(".sign-up-step-2 .popup-cta-button")[0]
                }
            }
        };

        var email = "";

        const PopupState = Object.freeze({
            inputEmail: "input-email",
            inputCode: "input-code"
        });
        const setState = (state) => {
            $([elements.steps.one.container, elements.steps.two.container]).hide();
            const containerToDisplay = (() => {
                switch (state) {
                    case PopupState.inputEmail: {
                        return elements.steps.one.container;
                    }
                    case PopupState.inputCode: {
                        return elements.steps.two.container;
                    }
                }
            })();
            $(containerToDisplay).show();
        };

        $(elements.steps.one.ctaButton).off().on("click", (event) => {
            event.preventDefault();
            
            email = $(elements.steps.one.emailInput).val();
            _this.requestAuthorizationCode(
                email,
                (error, api) => {
                    if (error) {
                        // TODO: Handle error
                    } else {
                        setState(
                            PopupState.inputCode
                        );
                    }
                }
            );
        });

        $(elements.steps.two.ctaButton).off().on("click", (event) => {
            event.preventDefault();

            const code = $(elements.steps.two.codeInput).val();
            _this.sendAuthorizationCode(
                code,
                email,
                (authorizationToken, error, api) => {
                    if (error) {
                        // TODO: Handle error
                    } else {
                        _this.getAccessUrl(
                            authorizationToken,
                            (accessUrl, error, api) => {
                                if (error) {
                                    // TODO: Handle error
                                } else {
                                    console.log(`Access URL: ${accessUrl}`);
                                }
                            }
                        )
                    }
                }
            );
        });
    }
}
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
     * @returns {string | undefined}
     */
    getAuthorizationToken = () => {
        return this._authorizationToken;
    }

    /**
     * @param {string | undefined} authorizationToken 
     */
    setAuthorizationToken = (authorizationToken) => {
        this._authorizationToken = authorizationToken;
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
            "Authorization": `Token ${authorizationToken}`
        };
        return api.jsonRequest(
            CommunityPhoneAPI.endpoints.portal_billing,
            "GET",
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

    setupUI = () => {
        const _this = this;

        const popup = this.getCreateAccountPopup();
        $(this.getUserPortalLink()).on("click", (event) => {
            event.preventDefault();
            
            if (_this._authorizationToken) {
                this.getAccessUrl(
                    _this._authorizationToken,
                    (accessUrl, error, api) => {
                        if (accessUrl && !error) {
                            _this.openAccessUrl(
                                accessUrl
                            );
                        } else {
                            popup.show();
                        }
                    }
                );
            } else {
                popup.show();
            }
        });

        const elements = {
            container: popup.getContainer(),
            steps: {
                one: {
                    container: popup.getContainer().querySelectorAll(".sign-up-step-1")[0],
                    emailInput: popup.getContainer().querySelectorAll(".sign-up-step-1 input.email-input")[0],
                    ctaButton: popup.getContainer().querySelectorAll(".sign-up-step-1 .popup-cta-button")[0],
                    errorMessage: {
                        container: popup.getContainer().querySelectorAll(".sign-up-step-1 .div-error-message-signup")[0],
                        text: popup.getContainer().querySelectorAll(".sign-up-step-1 .error-message-text")[0]
                    }
                },
                two: {
                    container: popup.getContainer().querySelectorAll(".sign-up-step-2")[0],
                    codeInput: popup.getContainer().querySelectorAll(".sign-up-step-2 input.code-input")[0],
                    userEmail: popup.getContainer().querySelectorAll(".sign-up-step-2 .user-email-span")[0],
                    changeEmailButton: popup.getContainer().querySelectorAll(".sign-up-step-2 .change-email-link"),
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
        const showErrorMessage = (message, state) => {
            switch (state) {
                case PopupState.inputEmail: {
                    if (message) {
                        $(elements.steps.one.errorMessage.container).show();
                        $(elements.steps.one.errorMessage.text).html(message);
                    } else {
                        $(elements.steps.one.errorMessage.container).hide();
                    }
                    break;
                }
                case PopupState.inputCode: {
                    alert(message);
                    break;
                }
            }
        };
        const defaultErrorMessage = Object.freeze({
            simple: `There has been a problem. Contact our customer support at 888-582-4177`,
            html: `There has been a problem. Contact our customer support at <a href="tel:8885824177">888-582-4177</a>`
        });

        $(elements.steps.one.ctaButton).off().on("click", (event) => {
            event.preventDefault();

            showErrorMessage(
                undefined,
                PopupState.inputEmail
            );
            
            email = $(elements.steps.one.emailInput).val();
            _this.requestAuthorizationCode(
                email,
                (error, api) => {
                    if (error) {
                        showErrorMessage(
                            api.getErrorMessage(error, true) ?? defaultErrorMessage.html,
                            PopupState.inputEmail
                        );
                    } else {
                        $(elements.steps.two.codeInput).val("");
                        $(elements.steps.two.userEmail).html(email);
                        setState(
                            PopupState.inputCode
                        );
                    }
                }
            );
        });

        $(elements.steps.two.changeEmailButton).off().on("click", (event) => {
            event.preventDefault();
            setState(
                PopupState.inputEmail
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
                        showErrorMessage(
                            api.getErrorMessage(error, true) ?? defaultErrorMessage.simple,
                            PopupState.inputCode
                        );
                    } else {
                        Store.local.write(
                            Store.keys.userPortal.authorizationToken,
                            authorizationToken
                        );
                        _this.getAccessUrl(
                            authorizationToken,
                            (accessUrl, error, api) => {
                                if (error) {
                                    showErrorMessage(
                                        api.getErrorMessage(error, true) ?? defaultErrorMessage.simple,
                                        PopupState.inputCode
                                    );
                                } else {
                                    this.openAccessUrl(
                                        accessUrl
                                    );
                                }
                            }
                        )
                    }
                }
            );
        });
    }

    /**
     * @param {string} accessUrl 
     */
    openAccessUrl = (accessUrl) => {
        window.location.href = accessUrl;
    }
}

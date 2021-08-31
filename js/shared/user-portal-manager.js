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
     * @param {boolean} visible 
     */
    setLinkVisible = (visible) => {
        const link = document.querySelectorAll(".user-portal-v1")[0];

        if (link) {
            visible ? $(link).show() : $(link).hide();
        }
    }

    /**
     * @returns {Popup}
     */
    getCreateAccountPopup = () => {
        return new Popup(".login-user-portal");
    }

    /**
     * @param {string} email 
     * @param {(error: any) => void} callback 
     */
    requestAuthorizationCode = (email, callback) => {
        const api = IS_PRODUCTION
            ? CommunityPhoneAPI.productionWithLatestVersion()
            : CommunityPhoneAPI.stagingWithLatestVersion();
        const data = {
            email: email
        };
        api.jsonRequest(
            CommunityPhoneAPI.endpoints.auth_email,
            "POST",
            data,
            (response, error) => {
                if (error) {
                    const errorMessage = api.getErrorMessage(error, true) ?? api.getErrorMessage(error, false);
                    alert(errorMessage);
                } else {
                }
            }
        );
    }
}
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
}
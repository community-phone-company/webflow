class CheckoutSession {

    static _currentSession;

    /**
     * @returns {CheckoutSession}
     */
    static getCurrent() {
        if (!this._currentSession) {
            this._currentSession = new CheckoutSession();
        }

        return this._currentSession;
    }
    
    constructor() {
        this._id = Store.local.read(
            Store.keys.checkoutFlow.sessionId
        );
        this._api = CommunityPhoneAPI.currentEnvironmentWithVersion("2");
    }

    /**
     * @returns {string | undefined}
     */
    getId() {
        return this._id;
    }

    storeId() {
        Store.local.write(
            Store.keys.checkoutFlow.sessionId,
            this._id
        );
    }

    /**
     * @returns {boolean}
     */
    isAuthorized() {
        return this._id != undefined;
    }

    /**
     * @param {(error: any) => void} callback 
     */
    create(callback) {
        this._api.jsonRequest(
            CommunityPhoneAPI.endpoints.checkout_sessions,
            "POST",
            undefined,
            undefined,
            (response, error) => {
                if (!error && response) {
                    const sessionId = response.session_id;
                    this._id = sessionId;
                }

                if (callback) {
                    callback(
                        error
                    );
                }
            }
        );
    }
}
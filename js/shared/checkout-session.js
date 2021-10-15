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
        this._data = undefined;
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
     * @param {((error: any) => void) | undefined} callback 
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    create(callback) {
        return this._api.jsonRequest(
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

    /**
     * @param {((error: any) => void) | undefined} callback 
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    read(callback) {
        return this._api.jsonRequest(
            CommunityPhoneAPI.endpoints.checkout_sessions_id(
                this._id
            ),
            "GET",
            undefined,
            {
                session_id: this._id
            },
            (response, error) => {
                this._data = response;

                if (callback) {
                    callback(
                        error
                    );
                }
            }
        );
    }

    /**
     * @param {any} data
     * @param {((error: any) => void) | undefined} callback 
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    update(data, callback) {
        const request = this._api.jsonRequest(
            CommunityPhoneAPI.endpoints.checkout_sessions_id(
                this._id
            ),
            "PATCH",
            undefined,
            data,
            (response, error) => {
                if (callback) {
                    callback(
                        error
                    );
                }
            }
        );
        this._lastUpdateRequest = request;
        return request;
    }

    stopLastUpdateRequest() {
        if (this._lastUpdateRequest) {
            this._lastUpdateRequest.abort();
        }
    }
}
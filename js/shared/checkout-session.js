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

    /**
     * @param {string} sessionId 
     * @returns {string}
     */
    static generateAbandonedCartLink(
        sessionId
    ) {
        return router.getAbsoluteUrl(
            RouterPath.landlineService,
            {
                [RouterPathParameter.checkoutSessionId]: sessionId
            },
            false
        );
    }

    constructor() {
        this.setId(
            Store.local.read(
                Store.keys.checkoutFlow.sessionId
            )
        );
        this._api = CommunityPhoneAPI.currentEnvironmentWithVersion("2");
    }

    /**
     * @returns {string | undefined}
     */
    getId() {
        return this._id;
    }

    /**
     * @param {string} id 
     */
    setId(id) {
        if (this._id === id) {
            return;
        }

        this._id = id;
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
                    this.setId(
                        sessionId
                    );
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
     * @param {((data: any, error: any) => void) | undefined} callback 
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
                if (callback) {
                    callback(
                        response,
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
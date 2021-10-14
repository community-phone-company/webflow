class CheckoutSession {

    static _currentSession;

    static getCurrent() {
        if (!this._currentSession) {
            this._currentSession = new CheckoutSession();
        }
    }

    constructor() {
        this._id = undefined;
    }

    /**
     * @returns {string | undefined}
     */
    getId() {
        return this._id;
    }

    /**
     * @param {(error: any) => void} callback 
     */
    create(callback) {
    }
}
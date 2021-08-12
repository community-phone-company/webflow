class Router {

    static _default = undefined

    static getDefault = () => {
        if (!this._default) {
            this._default = new Router();
        }

        return this._default;
    }

    /**
     * @constructor
     */
    constructor() {
    }

    open = (path) => {
        window.location.href = `${window.location.host}${path}`;
    }
}

const RouterPath = Object.freeze({
    home: "/",
    landlineService: "/landline",
});
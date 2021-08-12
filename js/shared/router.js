class Router {

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * Redirects to the specified page.
     * @param {string} path Path for the page. It's recommended to use {@link RouterPath} values here.
     */
    open = (path) => {
        window.location.href = `${window.location.host}${path}`;
    }

    /**
     * @returns {any}
     */
    getParameters = () => {
        return Object.fromEntries(
            new URLSearchParams(
                window.location.search
            ).entries()
        );
    }

    /**
     * Reads URL parameter's value.
     * @param {string} key URL parameter's key.
     * @returns {any | undefined} Parameter's value or undefined.
     */
    getParameterValue = (key) => {
        const allParameters = this.getParameters();
        return allParameters[key];
    }
}

const RouterPath = Object.freeze({
    home: "/",
    landlineService: "/landline",
});

const RouterPathParameter = Object.freeze({
    portingActivated: "porting_activated",
    newNumberActivated: "new_number_activated"
});

const router = new Router();
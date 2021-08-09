/**
 * This class solves some issues that are not solved by the original Recaptcha.
 */
class RecaptchaManager {

    /**
     * @returns {RecaptchaManager} Default `RecaptchaManager` instance.
     */
    static getDefault = () => {
        if (!this._default) {
            this._default = new RecaptchaManager();
        }

        return this._default;
    }

    /**
     * @constructor
     */
    constructor() {
        this._isValid = this.isValid();
    }

    /**
     * @returns {boolean}
     */
    isValid = () => {
        const response = (() => {
            if (grecaptcha) {
                const getResponse = grecaptcha.getResponse;

                if (getResponse instanceof Function) {
                    const response = getResponse();
                    return typeof response === "string" ? response : "";
                }
            }

            return "";
        })();
        return response.length > 0;
    }

    /**
     * @param {(isCaptchaValid: boolean) => void} callback Function that is called everytime when captcha's value has changed.
     */
    startObserving = (callback) => {
        this._timer = setInterval(() => {
            const currentValue = this.isValid();

            if (this._isValid !== currentValue) {
                this._isValid = currentValue;
                
                if (callback) {
                    callback(
                        currentValue
                    );
                }
            }
        }, 20);
    }

    stopObserving = () => {
        if (this._timer) {
            clearInterval(
                this._timer
            );
        }
    }
}
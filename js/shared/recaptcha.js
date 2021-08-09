/**
 * This class solves some issues that are not solved by the original Recaptcha.
 */
class RecaptchaManager {

    constructor() {
        this._lastValue = this.getCurrentValue();
    }

    /**
     * @returns {string}
     */
    getCurrentValue = () => {
        const response = grecaptcha && grecaptcha.getResponse();
        return typeof response === "string" ? response : "";
    }

    /**
     * @returns {boolean}
     */
    isValid = () => {
        const currentValue = this.getCurrentValue();
        return currentValue.length > 0;
    }

    /**
     * @param {(isCaptchaValid: boolean) => void} callback Function that is called everytime when captcha's value has changed.
     */
    startObserving = (callback) => {
        this._timer = setInterval(() => {
            const newValue = this.getCurrentValue();

            if (this._lastValue !== newValue) {
                this._lastValue = newValue;
                const isCaptchaValid = newValue.length > 0;
                
                if (callback) {
                    callback(
                        isCaptchaValid
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
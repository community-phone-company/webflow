class InputValueObserver {

    /**
     * @constructor
     * @param {HTMLInputElement} input 
     */
    constructor(input) {
        this.input = input;
        this._lastValue = input.value;
    }

    /**
     * @param {(newValue: string) => void} onValueChanged 
     */
    startObserving = (onValueChanged) => {
        this._timerId = setInterval(() => {
            const currentValue = this.input.value;

            if (this._lastValue !== currentValue) {
                this._lastValue = currentValue;
                onValueChanged(currentValue);
            }
        }, 10);
    }

    stopObserving = () => {
        if (this._timerId) {
            clearInterval(
                this._timerId
            );
            this._timerId = undefined;
        }
    }
}
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
        this._onValueChanged = onValueChanged;
        this._timerId = setInterval(() => {
            const currentValue = this.input.value;

            if (this._lastValue !== currentValue) {
                this._lastValue = currentValue;
                
                if (this._onValueChanged instanceof Function) {
                    this._onValueChanged(currentValue);
                }
            }
        }, InputValueObserverConfiguration.timerInterval);
    }

    stopObserving = () => {
        this._onValueChanged = undefined;
        if (this._timerId) {
            clearInterval(
                this._timerId
            );
            this._timerId = undefined;
        }
    }
}

const InputValueObserverConfiguration = Object.freeze({
    timerInterval: 20
});
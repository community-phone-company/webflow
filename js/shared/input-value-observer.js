class InputValueObserver {

    /**
     * @constructor
     * @param {HTMLInputElement} input 
     * @param {boolean} highPerformance
     */
    constructor(input, highPerformance) {
        this.input = input;
        this.highPerformance = highPerformance;
        this._lastValue = input.value;
    }

    /**
     * @param {(newValue: string) => void} onValueChanged Function that is called when input's value has changed.
     */
    startObserving = (onValueChanged) => {
        this._onValueChanged = onValueChanged;

        const checkValue = () => {
            const currentValue = this.input.value;

            if (this._lastValue !== currentValue) {
                this._lastValue = currentValue;

                if (this._onValueChanged instanceof Function) {
                    this._onValueChanged(currentValue);
                }
            }
        };
        
        if (this.highPerformance) {
            this.input.oninput = () => {
                checkValue();
            };
        } else {
            this._timerId = setInterval(() => {
                checkValue();
            }, InputValueObserverConfiguration.timerInterval);
        }
    }

    stopObserving = () => {
        this._onValueChanged = undefined;
        
        if (this.highPerformance) {
            this.input.oninput = undefined;
        } else {
            if (this._timerId) {
                clearInterval(
                    this._timerId
                );
                this._timerId = undefined;
            }
        }
    }
}

const InputValueObserverConfiguration = Object.freeze({
    timerInterval: 20
});
/**
 * Represents switcher component from Webflow.
 */
class Switcher {

    /**
     * 
     * @param {HTMLDivElement} container Div element that contains the switcher.
     * @param {boolean} isOn Defines whether the switcher is on by default.
     */
    constructor(container, isOn) {
        this._containerDiv = container;
        this._isOn = isOn;
    }

    /**
     * Container.
     * @returns {HTMLDivElement} Div element that contains the switcher.
     */
    getContainerDiv = () => {
        return this._containerDiv;
    }

    /**
     * Defines whether the switcher is on.
     * @returns {boolean} Current state of the switcher.
     */
    isOn = () => {
        return this._isOn;
    }

    /**
     * @param {boolean} on State of the switcher.
     * @returns {Switcher} Current {@link Switcher} instance.
     */
    setOn = (on) => {
        this._isOn = on;
        return this;
    }

    /**
     * Watches for state of the switcher by counting clicks.
     * Each click toggles the state.
     * @param {(switcher: Switcher) => void} handler Function that is called every time when switcher's state has changed.
     * @returns {Switcher} Current {@link Switcher} instance.
     */
    startWatchingForStateChanges = (handler) => {
        this._switcherStateChangeHandler = handler;
        $(this._containerDiv).on("click", () => {
            this._isOn = !this._isOn;
            this._switcherStateChangeHandler(
                this
            );
        });
        return this;
    }
}
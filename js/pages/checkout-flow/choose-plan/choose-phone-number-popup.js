class ChoosePhoneNumberPopup {

    /**
     * @constructor
     * @param {HTMLElement | string} container Popup container. Should be an `HTMLElement` instance or a string containing selector.
     */
    constructor(container) {
        if (container instanceof HTMLElement) {
            this._container = container;
        } else if (typeof container === "string") {
            const containerElement = document.querySelectorAll(container)[0];

            if (!containerElement) {
                throw new Error(`Popup container not found with selector: ${container}`);
            }

            this._container = containerElement;
        } else {
            throw new Error(`Popup container not found`);
        }

        this._userInterface = Object.freeze({
            popup: new Popup(this._container),
            filter: {
                switcher: {
                    areaCode: this._container.querySelectorAll("#filter-by-area-code")[0],
                    tollFree: this._container.querySelectorAll("#filter-by-toll-free")[0],
                    city: this._container.querySelectorAll("#filter-by-city")[0]
                },
                valueInput: this._container.querySelectorAll("#filter-text-input")[0]
            },
            availableNumbers: {
                title: this._container.querySelectorAll("#available-numbers-title")[0],
                subtitle: this._container.querySelectorAll("#available-numbers-subtitle")[0],
                listContainer: this._container.querySelectorAll(".list-of-numbers")[0]
            }
        });

        this._setupUserInterface();
        this._filter = new ChoosePhoneNumberPopupFilter(
            ChoosePhoneNumberPopupFilterState.areaCode,
            ""
        );
    }

    _setupUserInterface = () => {
    }

    getContainer = () => {
        return this._container;
    }

    /**
     * @returns {Popup}
     */
    getPopup = () => {
        return this._userInterface.popup;
    }

    /**
     * @returns {ChoosePhoneNumberPopupFilter}
     */
    getFilter = () => {
        return this._filter;
    }
}

class ChoosePhoneNumberPopupFilter {

    /**
     * @constructor
     * @param {string} state 
     * @param {string} value 
     */
    constructor(state, value) {
        this.state = state;
        this.value = value;
    }
}

const ChoosePhoneNumberPopupFilterState = Object.freeze({
    areaCode: "area-code",
    tollFree: "toll-free",
    city: "city"
});

class ChoosePhoneNumberPopupItemCard {

    constructor() {
    }
}
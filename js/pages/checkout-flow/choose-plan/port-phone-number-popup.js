class PortPhoneNumberPopup {

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
            sections: {
                technicalData: {
                    accountNumberInput: this._container.querySelectorAll("#porting-info-popup_account-number-input")[0],
                    pinInput: this._container.querySelectorAll("#porting-info-popup_pin-input")[0],
                    accountNumberInput: this._container.querySelectorAll("#porting-info-popup_name-in-the-account-input")[0],
                    numberToPort: this._container.querySelectorAll("#porting-info-popup_number-to-port-input")[0]
                },
                serviceAddress: {
                    firstNameInput: this._container.querySelectorAll("#porting-info-popup_first-name-input")[0],
                    lastNameInput: this._container.querySelectorAll("#porting-info-popup_last-name-input")[0],
                    addressLineOneInput: this._container.querySelectorAll("#porting-info-popup_address-line-one-input")[0],
                    addressLineTwoInput: this._container.querySelectorAll("#porting-info-popup_address-line-two-input")[0],
                    cityInput: this._container.querySelectorAll("#porting-info-popup_city-input")[0],
                    zipInput: this._container.querySelectorAll("#porting-info-popup_zip-input")[0],
                    stateSelect: this._container.querySelectorAll("#porting-info-popup_state-select")[0]
                }
            },
            submitButton: this._container.querySelectorAll("popup-cta-button")[0]
        });

        this._setupUserInterface();
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
     * @param {(() => void) | undefined} handler 
     */
    onSubmit = (handler) => {
        this._onSubmitHandler = handler;
    }
}
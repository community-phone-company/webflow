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

        this._form = {
            data: {
                technicalData: {
                    carrierName: "",
                    accountNumber: "",
                    pin: "",
                    accountName: "",
                    numberToPort: ""
                },
                serviceAddress: {
                    firstName: "",
                    lastName: "",
                    addressLineOne: "",
                    addressLineTwo: "",
                    city: "",
                    zip: "",
                    state: "AL"
                }
            },
            userInterface: {
                popup: new Popup(this._container),
                steps: {
                    carrierInformation: (() => {
                        const container = this._container.querySelectorAll("div.step-1-carrier-info")[0];
                        return {
                            container: container,
                            list: container.querySelectorAll("div.w-dyn-items"),
                            cards: Array.from(
                                container.querySelectorAll("div.w-dyn-item")
                            )
                        };
                    })(),
                    portingInformation: (() => {
                        const container = this._container.querySelectorAll("div.step-2-porting-info")[0];
                        return {
                            container: container,
                            sections: {
                                technicalData: {
                                    accountNumberInput: container.querySelectorAll("#porting-info-popup_account-number-input")[0],
                                    pinInput: container.querySelectorAll("#porting-info-popup_pin-input")[0],
                                    accountNameInput: container.querySelectorAll("#porting-info-popup_name-in-the-account-input")[0],
                                    numberToPortInput: container.querySelectorAll("#porting-info-popup_number-to-port-input")[0]
                                },
                                serviceAddress: {
                                    firstNameInput: container.querySelectorAll("#porting-info-popup_first-name-input")[0],
                                    lastNameInput: container.querySelectorAll("#porting-info-popup_last-name-input")[0],
                                    addressLineOneInput: container.querySelectorAll("#porting-info-popup_address-line-one-input")[0],
                                    addressLineTwoInput: container.querySelectorAll("#porting-info-popup_address-line-two-input")[0],
                                    cityInput: container.querySelectorAll("#porting-info-popup_city-input")[0],
                                    zipInput: container.querySelectorAll("#porting-info-popup_zip-input")[0],
                                    stateSelect: container.querySelectorAll("#porting-info-popup_state-select")[0]
                                }
                            },
                            submitButton: container.querySelectorAll(".popup-cta-button")[0]
                        };
                    })()
                }
            }
        };

        this._setupUserInterface();
    }

    _setupUserInterface = () => {
        $(this._form.userInterface.steps.carrierInformation.cards).on("click", (event) => {
            const selectedCard = event.currentTarget;
            this._form.data.technicalData.carrierName = selectedCard.querySelectorAll(".body-2-carrier")[0].innerText;

            this._form.userInterface.steps.carrierInformation.cards.forEach(card => {
                if (card != selectedCard) {
                    $(card).click();
                }
            });
        });

        this._form.userInterface.steps.portingInformation.sections.technicalData.accountNumberInput.oninput = () => {
            this._form.data.technicalData.accountNumber = this._form.userInterface.steps.portingInformation.sections.technicalData.accountNumberInput.value;
            this._handleFormChange();
        };
        this._form.userInterface.steps.portingInformation.sections.technicalData.pinInput.oninput = () => {
            this._form.data.technicalData.pin = this._form.userInterface.steps.portingInformation.sections.technicalData.pinInput.value;
            this._handleFormChange();
        };
        this._form.userInterface.steps.portingInformation.sections.technicalData.accountNameInput.oninput = () => {
            this._form.data.technicalData.accountName = this._form.userInterface.steps.portingInformation.sections.technicalData.accountNameInput.value;
            this._handleFormChange();
        };
        this._form.userInterface.steps.portingInformation.sections.technicalData.numberToPortInput.oninput = () => {
            this._form.data.technicalData.numberToPort = this._form.userInterface.steps.portingInformation.sections.technicalData.numberToPortInput.value;
            this._handleFormChange();
        };
        this._form.userInterface.steps.portingInformation.sections.serviceAddress.firstNameInput.oninput = () => {
            this._form.data.serviceAddress.firstName = this._form.userInterface.steps.portingInformation.sections.serviceAddress.firstNameInput.value;
            this._handleFormChange();
        };
        this._form.userInterface.steps.portingInformation.sections.serviceAddress.lastNameInput.oninput = () => {
            this._form.data.serviceAddress.lastName = this._form.userInterface.steps.portingInformation.sections.serviceAddress.lastNameInput.value;
            this._handleFormChange();
        };
        this._form.userInterface.steps.portingInformation.sections.serviceAddress.addressLineOneInput.oninput = () => {
            this._form.data.serviceAddress.addressLineOne = this._form.userInterface.steps.portingInformation.sections.serviceAddress.addressLineOneInput.value;
            this._handleFormChange();
        };
        this._form.userInterface.steps.portingInformation.sections.serviceAddress.addressLineTwoInput.oninput = () => {
            this._form.data.serviceAddress.addressLineTwo = this._form.userInterface.steps.portingInformation.sections.serviceAddress.addressLineTwoInput.value;
            this._handleFormChange();
        };
        this._form.userInterface.steps.portingInformation.sections.serviceAddress.cityInput.oninput = () => {
            this._form.data.serviceAddress.city = this._form.userInterface.steps.portingInformation.sections.serviceAddress.cityInput.value;
            this._handleFormChange();
        };
        this._form.userInterface.steps.portingInformation.sections.serviceAddress.zipInput.oninput = () => {
            this._form.data.serviceAddress.zip = this._form.userInterface.steps.portingInformation.sections.serviceAddress.zipInput.value;
            this._handleFormChange();
        };
        this._form.userInterface.steps.portingInformation.sections.serviceAddress.stateSelect.oninput = () => {
            this._form.data.serviceAddress.state = this._form.userInterface.steps.portingInformation.sections.serviceAddress.stateSelect.value;
            this._handleFormChange();
        };

        this._form.userInterface.popup
            .onShow(() => {
                this._handleFormChange();
            })
            .onCTAButtonClicked((popup) => {
                if (this._onSubmitHandler) {
                    this._onSubmitHandler();
                }
            });

        this._handleFormChange();
    }

    _handleFormChange = () => {
        const isFormValid = this._form.data.technicalData.accountNumber.length > 0
            && this._form.data.technicalData.pin.length > 0
            && this._form.data.technicalData.accountName.length > 0
            && this._form.data.technicalData.numberToPort.length > 0
            && this._form.data.serviceAddress.firstName.length > 0
            && this._form.data.serviceAddress.lastName.length > 0
            && this._form.data.serviceAddress.addressLineOne.length > 0
            && this._form.data.serviceAddress.addressLineTwo.length > 0
            && this._form.data.serviceAddress.city.length > 0
            && this._form.data.serviceAddress.zip.length > 0
            && this._form.data.serviceAddress.state.length > 0;
        UserInterface.setElementEnabled(
            this._form.userInterface.submitButton,
            isFormValid
        );
    }

    getContainer = () => {
        return this._container;
    }

    /**
     * @returns {Popup}
     */
    getPopup = () => {
        return this._form.userInterface.popup;
    }

    getFormData = () => {
        return this._form.data;
    }

    /**
     * @param {(() => void) | undefined} handler 
     */
    onSubmit = (handler) => {
        this._onSubmitHandler = handler;
    }
}
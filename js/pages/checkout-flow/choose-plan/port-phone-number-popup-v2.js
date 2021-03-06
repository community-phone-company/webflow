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
                backButton: this._container.querySelectorAll("#modal-collect-porting-info_back-button")[0],
                steps: {
                    carrierInformation: (() => {
                        const container = this._container.querySelectorAll("div.step-1-carrier-info")[0];
                        return {
                            container: container,
                            list: container.querySelectorAll("div.w-dyn-items"),
                            cards: Array.from(
                                container.querySelectorAll("div.w-dyn-item")
                            ),
                            footer: container.querySelectorAll("#modal-collect-porting-info_step-one-footer")[0],
                            submitButton: container.querySelectorAll("#modal-collect-porting-info_step-one-submit-button")[0]
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
        $(this._form.userInterface.backButton).on("click", (event) => {
            $(this._form.userInterface.backButton).hide();
        });
        
        $(this._form.userInterface.steps.carrierInformation.cards).on("click", (event) => {
            const selectedCard = event.currentTarget;
            this._form.data.technicalData.carrierName = this.getCarrierNameFromCard(
                selectedCard
            );

            this._form.userInterface.steps.carrierInformation.cards.forEach(card => this.makeCarrierCardSelected(card, card === selectedCard));
            $(this._form.userInterface.steps.carrierInformation.footer).css({transform: ""});
        });

        $(this._form.userInterface.steps.carrierInformation.submitButton).on("click", (event) => {
            $(this._form.userInterface.backButton).show();
        });

        this.makeAllCarrierCardsCollapsed();

        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.technicalData.accountNumberInput).startObserving((newValue) => {
            this._form.data.technicalData.accountNumber = newValue;
            this._handleFormChange();
        });
        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.technicalData.pinInput).startObserving((newValue) => {
            this._form.data.technicalData.pin = newValue;
            this._handleFormChange();
        });
        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.technicalData.accountNameInput).startObserving((newValue) => {
            this._form.data.technicalData.accountName = newValue;
            this._handleFormChange();
        });
        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.technicalData.numberToPortInput).startObserving((newValue) => {
            this._form.data.technicalData.numberToPort = newValue;
            this._handleFormChange();
        });
        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.serviceAddress.firstNameInput).startObserving((newValue) => {
            this._form.data.serviceAddress.firstName = newValue;
            this._handleFormChange();
        });
        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.serviceAddress.lastNameInput).startObserving((newValue) => {
            this._form.data.serviceAddress.lastName = newValue;
            this._handleFormChange();
        });
        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.serviceAddress.addressLineOneInput).startObserving((newValue) => {
            this._form.data.serviceAddress.addressLineOne = newValue;
            this._handleFormChange();
        });
        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.serviceAddress.addressLineTwoInput).startObserving((newValue) => {
            this._form.data.serviceAddress.addressLineTwo = newValue;
            this._handleFormChange();
        });
        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.serviceAddress.cityInput).startObserving((newValue) => {
            this._form.data.serviceAddress.city = newValue;
            this._handleFormChange();
        });
        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.serviceAddress.zipInput).startObserving((newValue) => {
            this._form.data.serviceAddress.zip = newValue;
            this._handleFormChange();
        });
        new InputValueObserver(this._form.userInterface.steps.portingInformation.sections.serviceAddress.stateSelect).startObserving((newValue) => {
            this._form.data.serviceAddress.state = newValue;
            this._handleFormChange();
        });

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
            && this._form.data.serviceAddress.city.length > 0
            && this._form.data.serviceAddress.zip.length > 0
            && this._form.data.serviceAddress.state.length > 0;
        UserInterface.setElementEnabled(
            this._form.userInterface.steps.portingInformation.submitButton,
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

    /**
     * @param {HTMLElement} card 
     * @returns {string}
     */
    getCarrierNameFromCard = (card) => {
        return $(card).find(".body-2-carrier:eq(0)").text();
    }
    
    /**
     * @param {HTMLElement} card 
     * @param {boolean} selected 
     */
    makeCarrierCardSelected = (card, selected) => {
        $(card).find("div.carrier-card").css({
            height: selected ? "auto" : "56px"
        });
    }

    makeAllCarrierCardsCollapsed = () => {
        this._form.userInterface.steps.carrierInformation.cards.forEach(card => this.makeCarrierCardSelected(card, false));
    }
}
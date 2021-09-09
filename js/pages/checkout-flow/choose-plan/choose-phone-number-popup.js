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
            ChoosePhoneNumberPopupFilterMode.areaCode,
            ""
        );
    }

    _setupUserInterface = () => {
        const switchFilterToMode = (mode) => {
            if (this._filter.mode === mode) {
                return;
            }

            const value = "";
            $(this._userInterface.filter.valueInput).val(
                value
            );
            this._filter = new ChoosePhoneNumberPopupFilter(
                mode,
                value
            );

            if (this._onFilterChangedHandler) {
                this._onFilterChangedHandler();
            }
        };

        const getModeForSwitcherItem = (item) => {
            if (item == this._userInterface.filter.switcher.areaCode) {
                return ChoosePhoneNumberPopupFilterMode.areaCode;
            } else if (item == this._userInterface.filter.switcher.tollFree) {
                return ChoosePhoneNumberPopupFilterMode.tollFree;
            } else if (item == this._userInterface.filter.switcher.city) {
                return ChoosePhoneNumberPopupFilterMode.city;
            } else {
                return ChoosePhoneNumberPopupFilterMode.areaCode;
            }
        };
        
        const allSwitcherItems = [
            this._userInterface.filter.switcher.areaCode,
            this._userInterface.filter.switcher.tollFree,
            this._userInterface.filter.switcher.city
        ];
        allSwitcherItems.forEach(item => {
            $(item).on("click", (event) => {
                event.preventDefault();
                $(allSwitcherItems).removeClass("current-tab");
                $(item).addClass("by-area-code current-tab");
                switchFilterToMode(
                    getModeForSwitcherItem(
                        item
                    )
                );
            });
        });

        this.setPhoneNumbers([]);
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
     * @param {PhoneNumber[]} phoneNumbers 
     */
    setPhoneNumbers = (phoneNumbers) => {
        const html = phoneNumbers
            .map(phoneNumber => {
                return new ChoosePhoneNumberPopupItemCard(
                    phoneNumber
                ).toHTML();
            })
            .reduce(
                (previous, current) => {
                    return `${previous}${current}`;
                },
                ""
            );
        $(this._userInterface.availableNumbers.listContainer).html(html);

        $(".div-phone-number").off().on("click", (event) => {
            event.preventDefault();
            const selectedCard = event.currentTarget;
            $(".div-phone-number .div-radio-button-2").removeClass("radio-selected");
            $(selectedCard).find(".div-radio-button-2").addClass("radio-selected");
            
            const selectedPhoneNumber = ChoosePhoneNumberPopupItemCard.getPhoneNumber(
                selectedCard
            );

            if (selectedPhoneNumber && this._onSelectedPhoneNumberHandler) {
                this._onSelectedPhoneNumberHandler(
                    selectedPhoneNumber
                );
            }
        });
    }

    /**
     * @returns {ChoosePhoneNumberPopupFilter}
     */
    getFilter = () => {
        return this._filter;
    }

    /**
     * @param {() => void} handler 
     */
    onFilterChanged = (handler) => {
        this._onFilterChangedHandler = handler;
    }

    /**
     * @param {(phoneNumber: PhoneNumber) => void} handler 
     */
    onSelectedPhoneNumber = (handler) => {
        this._onSelectedPhoneNumberHandler = handler;
    }
}

class ChoosePhoneNumberPopupFilter {

    /**
     * @constructor
     * @param {string} mode 
     * @param {string} value 
     */
    constructor(mode, value) {
        this.mode = mode;
        this.value = value;
    }
}

const ChoosePhoneNumberPopupFilterMode = Object.freeze({
    areaCode: "area-code",
    tollFree: "toll-free",
    city: "city"
});

class ChoosePhoneNumberPopupItemCard {

    /**
     * @returns {string}
     */
    static getSerializedPhoneNumberKey = () => {
        return "serialized-phone-number";
    }

    /**
     * @param {HTMLElement} card 
     * @returns {PhoneNumber | undefined}
     */
    static getPhoneNumber = (card) => {
        const serializedPhoneNumber = $(card).attr(this.getSerializedPhoneNumberKey());
        const phoneNumber = PhoneNumber.deserialize(
            serializedPhoneNumber
        );
        return phoneNumber;
    }

    /**
     * @constructor
     * @param {PhoneNumber} phoneNumber 
     */
    constructor(phoneNumber) {
        this._phoneNumber = phoneNumber;
    }

    /**
     * @returns {string}
     */
    toHTML = () => {
        return `
            <div
                class="div-phone-number"
                ${ChoosePhoneNumberPopupItemCard.getSerializedPhoneNumberKey()}=${this._phoneNumber.serialize()}
            >
                <div class="div-block-21">
                    <div class="div-radio-button-2">
                    </div>
                    <div class="_w-8">
                    </div>
                    <div class="txt-phone-number-2">
                        ${this._phoneNumber.formatted()}
                    </div>
                </div>
                <div class="txt-lacation-2">
                    ${(() => {
                        const hasCity = this._phoneNumber.city.length > 0;
                        const hasStateCode = this._phoneNumber.stateCode.length > 0;

                        if (hasCity && hasStateCode) {
                            return `${this._phoneNumber.city}, ${this._phoneNumber.stateCode}`;
                        } else {
                            return ``;
                        }
                    })()}
                </div>
            </div>
            <div class="devider-8px">
            </div>
        `;
    }
}
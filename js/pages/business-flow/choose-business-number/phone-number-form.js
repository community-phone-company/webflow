/**
 * Represents phone number form.
 * 
 * Usage example:
 * 
 * ```
 * const form = new PhoneNumberForm("form");
 * form.getLeftColumn().setItems([
 *     new PhoneNumberFormColumnItem(
 *         "(000) 000-0000",
 *         "Cupertino",
 *         "CA"
 *     )
 * ]);
 * ```
 */
class PhoneNumberForm {

    /**
     * @constructor
     * @param {string} formSelector 
     */
    constructor(formSelector) {
        const form = document.querySelectorAll(formSelector)[0]

        if (form instanceof HTMLFormElement) {
            this._form = form;
        } else {
            throw new Error(`${formSelector} is not HTMLFormElement!`);
        }
    }

    getForm = () => {
        return this._form;
    }

    /**
     * City input.
     * @returns {HTMLInputElement} `HTMLInputElement` instance.
     */
    getCityInput = () => {
        /**
         * Some kind of lazy load implementation.
         * Once we call this method, it will remember the element
         * so we won't need to search it again over the entire document.
         */
        if (this._cityInput) {
            return this._cityInput;
        }

        const selector = "#city";
        const input = this.getForm().querySelectorAll(selector)[0];
        
        if (input instanceof HTMLInputElement) {
            this._cityInput = input;
            return input;
        } else {
            throw new Error(`${selector} is not an HTMLInputElement.`);
        }
    }

    /**
     * City search field.
     * @returns {PhoneNumberFormSearchField} Instance of {@link PhoneNumberFormSearchField} type.
     */
    getCitySearchField = () => {
        if (!this._citySearchField) {
            this._citySearchField = new PhoneNumberFormSearchField(
                this.getCityInput()
            );
        }

        return this._citySearchField;
    }

    /**
     * Area code input.
     * @returns {HTMLInputElement} `HTMLInputElement` instance.
     */
    getAreaCodeInput = () => {
        /**
         * Some kind of lazy load implementation.
         * Once we call this method, it will remember the element
         * so we won't need to search it again over the entire document.
         */
        if (this._areaCodeInput) {
            return this._areaCodeInput;
        }

        const selector = "#Area-code";
        const input = this.getForm().querySelectorAll(selector)[0];
        
        if (input instanceof HTMLInputElement) {
            this._areaCodeInput = input;
            return input;
        } else {
            throw new Error(`${selector} is not an HTMLInputElement.`);
        }
    }

    /**
     * Area code search field.
     * @returns {PhoneNumberFormSearchField} Instance of {@link PhoneNumberFormSearchField} type.
     */
    getAreaCodeSearchField = () => {
        if (!this._areaCodeSearchField) {
            this._areaCodeSearchField = new PhoneNumberFormSearchField(
                this.getAreaCodeInput()
            );
        }

        return this._areaCodeSearchField;
    }

    /**
     * Digits input.
     * @returns {HTMLInputElement} `HTMLInputElement` instance.
     */
    getDigitsInput = () => {
        /**
         * Some kind of lazy load implementation.
         * Once we call this method, it will remember the element
         * so we won't need to search it again over the entire document.
         */
        if (this._digitsInput) {
            return this._digitsInput;
        }

        const selector = "#digits";
        const input = this.getForm().querySelectorAll(selector)[0];
        
        if (input instanceof HTMLInputElement) {
            this._digitsInput = input;
            return input;
        } else {
            throw new Error(`${selector} is not an HTMLInputElement.`);
        }
    }

    /**
     * Toll free switcher.
     * @returns {Switcher} Instance of {@link Switcher} type.
     */
    getTollFreeSwitcher = () => {
        if (!this._tollFreeSwitcher) {
            const selector = "#toll-free-switcher";
            const switcherDiv = this.getForm().querySelectorAll(selector)[0];

            if (!(switcherDiv instanceof HTMLDivElement)) {
                throw new Error(`${selector} is not an HTMLDivElement.`);
            }

            this._tollFreeSwitcher = new Switcher(
                switcherDiv,
                false
            );
        }
        
        return this._tollFreeSwitcher;
    }

    /**
     * Location link.
     * @returns {HTMLAnchorElement} `HTMLAnchorElement` instance.
     */
    getLocationLink = () => {
        if (!this._locationLink) {
            const selector = "#link-location";
            const locationLink = this.getForm().querySelectorAll(selector)[0];

            if (!(locationLink instanceof HTMLAnchorElement)) {
                throw new Error(`${selector} is not an HTMLAnchorElement.`);
            }

            this._locationLink = locationLink;
        }

        return this._locationLink;
    }

    /**
     * Updates visiblity of the location link.
     * @param {boolean} visible Defines whether the location link should be visible.
     */
    setLocationLinkVisible = (visible) => {
        $(this.getLocationLink()).css(
            "visibility",
            visible ? "visible" : "hidden"
        );
    }

    /**
     * Columns.
     * @returns {PhoneNumberFormColumn[]} Array of {@link PhoneNumberFormColumn} instances.
     */
    getColumns = () => {
        if (!this._columns) {
            const selector = "div.columns-6.w-row div.w-col.w-col-6";
            this._columns = Array.from(
                this.getForm().querySelectorAll(selector)
            ).map(columnDiv => {
                return new PhoneNumberFormColumn(columnDiv);
            });
        }

        return this._columns;
    }

    /**
     * Left column.
     * @returns {PhoneNumberFormColumn} `PhoneNumberFormColumn` instance.
     */
    getLeftColumn = () => {
        return this.getColumns()[0];
    }

    /**
     * Right column.
     * @returns {PhoneNumberFormColumn} `PhoneNumberFormColumn` instance.
     */
    getRightColumn = () => {
        return this.getColumns()[1];
    }

    /**
     * Available numbers container.
     * @returns {HTMLDivElement} `HTMLDivElement` instance.
     */
    getAvailableNumbersContainer = () => {
        if (!this._availableNumbersContainer) {
            this._availableNumbersContainer = this.getForm().querySelectorAll("div#available-numbers")[0];
        }

        return this._availableNumbersContainer;
    }

    /**
     * Empty state container.
     * @returns {HTMLDivElement} `HTMLDivElement` instance.
     */
    getEmptyStateContainer = () => {
        if (!this._emptyStateDiv) {
            this._emptyStateDiv = this.getForm().querySelectorAll("div#phone-numbers-empty-state")[0];
        }

        return this._emptyStateDiv;
    }

    /**
     * @param {boolean} visible 
     */
    setEmptyStateVisible = (visible) => {
        if (visible) {
            $(this.getAvailableNumbersContainer()).hide();
            $(this.getForm()).find("#available-numbers-title").hide();
            $(this.getForm()).find("#available-numbers-subtitle").hide();
            $(this.getEmptyStateContainer()).show();
            $(this.getSubmitButton()).hide();
        } else {
            $(this.getAvailableNumbersContainer()).show();
            $(this.getForm()).find("#available-numbers-title").show();
            $(this.getForm()).find("#available-numbers-subtitle").show();
            $(this.getEmptyStateContainer()).hide();
            $(this.getSubmitButton()).show();
        }
    }

    /**
     * Submit button.
     * @returns {HTMLInputElement} `HTMLInputElement` instance.
     */
    getSubmitButton = () => {
        /**
         * Some kind of lazy load implementation.
         * Once we call this method, it will remember the element
         * so we won't need to search it again over the entire document.
         */
        if (this._submitButton) {
            return this._submitButton;
        }

        const selector = "#submit-button";
        const input = this.getForm().querySelectorAll(selector)[0];
        
        if (input instanceof HTMLInputElement) {
            this._submitButton = input;
            return input;
        } else {
            throw new Error(`${selector} is not an HTMLInputElement.`);
        }
    }
}

class PhoneNumberFormSearchField {

    /**
     * @constructor
     * @param {HTMLInputElement} input 
     */
    constructor(input) {
        this.input = input;
        this.setAutocompleteItems([]);
        this._refreshAutocompleteItemsAutomatically = false;
        this._onQuery = undefined;
        this._onSelectedAutocompleteItem = undefined;
    }

    /**
     * @param {InputAutocompleteItem[]} items Autocomplete items.
     * @returns {PhoneNumberFormSearchField} Current {@link PhoneNumberFormSearchField} instance.
     */
    setAutocompleteItems(items) {
        this.autocompleteItems = items;
        $(this.input).autocomplete({
            source: items.map(item => {
                return {
                    label: ` ${item.text.trimStart()}`,
                    value: item.text.trimStart()
                };
            })
        });
        return this;
    }

    /**
     * @param {string} value Value.
     * @param {() => void} callback Callback.
     */
    refreshAutocompleteItemsForValue = (value, callback) => {
        if (this._lastRequest) {
            this._lastRequest.abort();
        }

        if (this._onQuery) {
            this._lastRequest = this._onQuery(value, (autocompleteItems) => {
                this.setAutocompleteItems(
                    autocompleteItems
                );
                
                if (callback) {
                    callback();
                }
            });
        } else {
            this.setAutocompleteItems([]);
            
            if (callback) {
                callback();
            }
        }
    }

    /**
     * Defines whether autocomplete items should be refreshed automatically
     * every time when input value has changed.
     * @param {boolean} refresh If `true`, autocomplete items will be automatically refreshed.
     * @returns {PhoneNumberFormSearchField} Current {@link PhoneNumberFormSearchField} instance.
     */
    refreshAutocompleteItemsAutomatically = (refresh) => {
        this._refreshAutocompleteItemsAutomatically = refresh;
        return this;
    };

    /**
     * @returns {InputAutocompleteItem | undefined} Instance of {@link InputAutocompleteItem} type or `undefined`.
     */
    getSelectedAutocompleteItem = () => {
        if (this._selectedAutocompleteItem) {
            return this._selectedAutocompleteItem;
        }

        const currentValue = this.input.value;
        const autocompleteItems = this.autocompleteItems ?? [];
        return autocompleteItems.find(item => item.text === currentValue);
    }

    /**
     * @param {boolean} expanding 
     * @returns {PhoneNumberFormSearchField} Current {@link PhoneNumberFormSearchField} instance.
     */
    setMenuExpandingOnFocus = (expanding) => {
        this._expandingMenuOnFocus = expanding;
        this.input.onfocus = this.input.onfocus = () => {
            if (this._expandingMenuOnFocus) {
                $(this.input).autocomplete(
                    "search",
                    this.input.value.length ? this.input.value : " "
                );
            }
        };
        return this;
    }

    /**
     * @returns {PhoneNumberFormSearchField} Current {@link PhoneNumberFormSearchField} instance.
     */
    startObserving = () => {
        $(this.input).autocomplete({
            select: (event, ui) => {
                console.log(`Selected autocomplete item for "${this.input.id}"`);
                
                const selectedItem = this.autocompleteItems.find(item => item.text === ui.item.text);
                this._selectedAutocompleteItem = selectedItem;

                if (this._onSelectedAutocompleteItem) {
                    this._onSelectedAutocompleteItem(
                        selectedItem
                    );
                }
            }
        });

        const valueObserver = new InputValueObserver(this.input);
        valueObserver.startObserving((newValue) => {
            console.log(`Changed input value for ${this.input.id}: ${newValue}`);
            
            if (this._onValueChanged) {
                this._onValueChanged(newValue);
            }

            if (this._refreshAutocompleteItemsAutomatically) {
                this.refreshAutocompleteItemsForValue(
                    newValue,
                    () => {
                    }
                );
            }
        });
        this.valueObserver = valueObserver;
        console.log(`Started observing input value for ${this.input.id}`);
        return this;
    }

    /**
     * @returns {PhoneNumberFormSearchField} Current {@link PhoneNumberFormSearchField} instance.
     */
    stopObserving = () => {
        if (this.valueObserver) {
            this.valueObserver.stopObserving();
            this.valueObserver = undefined;
        }

        return this;
    }

    /**
     * @param {(newValue: string) => void} handler Function that is called when value has changed.
     * @returns {PhoneNumberFormSearchField} Current {@link PhoneNumberFormSearchField} instance.
     */
    onValueChanged = (handler) => {
        this._onValueChanged = handler;
        return this;
    }

    /**
     * @param {(query: string, response: (autocompleteItems: InputAutocompleteItem[]) => void) => (XMLHttpRequest | undefined)} handler 
     * @returns {PhoneNumberFormSearchField} Current {@link PhonPhoneNumberFormSearchFieldeNumberForm} instance.
     */
    onQuery = (handler) => {
        this._onQuery = handler;
        return this;
    }

    /**
     * @param {(item: InputAutocompleteItem) => void} handler 
     * @returns {PhoneNumberFormSearchField} Current {@link PhoneNumberFormSearchField} instance.
     */
    onSelectedAutocompleteItem = (handler) => {
        this._onSelectedAutocompleteItem = handler;
        return this;
    }
}

class InputAutocompleteItem {

    /**
     * 
     * @param {string} text Item's text that will be displayed.
     * @param {any} value Item's value that is hidden from the user.
     */
    constructor(text, value) {
        this.text = text;
        this.value = value;
    }
}

class PhoneNumberFormColumn {

    /**
     * @constructor
     * @param {HTMLDivElement} columnDiv 
     */
    constructor(columnDiv) {
        this.columnDiv = columnDiv;
        this._items = new Array<PhoneNumberFormColumnItem>(0);
    }

    /**
     * 
     * @param {PhoneNumberFormColumnItem[]} items Items.
     */
    setItems = (items) => {
        this._items = items;
        
        var columnInternalHtml = ``;

        for (const item of items) {
            const html = item.toHTML();
            columnInternalHtml += html;
        }

        $(this.columnDiv).html(columnInternalHtml);
    }
}

class PhoneNumberFormColumnItem {

    /**
     * @constructor
     * @param {string} phone Phone.
     * @param {string} city City.
     * @param {string} stateCode State code.
     */
    constructor(
        phone,
        city,
        stateCode
    ) {
        this.phone = phone;
        this.city = city;
        this.stateCode = stateCode;
    }

    /**
     * Converts `PhoneNumberFormColumnItem` instance into HTML string.
     * @returns {string} String containing HTML structure for `PhoneNumberFormColumnItem` instance.
     */
    toHTML = () => {
        return `
            <div class="phone-number" phone-number="${this.phone}">
                <div class="columns-8 w-row">
                    <div class="column-9 w-col w-col-2">
                        <div class="div-radio-button">
                        </div>
                    </div>
                    <div class="w-col w-col-5">
                        <div class="txt-phone-number">
                            ${this.phone}
                        </div>
                    </div>
                    <div class="w-col w-col-5">
                        <div class="txt-lacation">
                            ${
                                (() => {
                                    const city = this.city ?? ""
                                    const stateCode = this.stateCode ?? ""
                                    
                                    if (city.length && stateCode.length) {
                                        return `${city}, ${stateCode}`;
                                    } else {
                                        return "";
                                    }
                                })()
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div class="devider-8px">
            </div>
        `;
    }
}
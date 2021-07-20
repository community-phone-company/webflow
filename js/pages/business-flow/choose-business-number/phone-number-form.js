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
     * @param {InputAutocompleteItem[]} items Autocomplete items.
     */
    setCityInputAutocompleteItems(items) {
        this.cityInputAutocompleteItems = items;
        $(this.getCityInput()).autocomplete({
            source: items.map(item => item.text)
        });
    }

    /**
     * @returns {InputAutocompleteItem | undefined} Instance of {@link InputAutocompleteItem} type or `undefined`.
     */
    getSelectedCityAutocompleteItem = () => {
        const currentValue = this.getCityInput().value;
        const autocompleteItems = this.cityInputAutocompleteItems ?? [];
        return autocompleteItems.find(item => item.text === currentValue);
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
     * @returns {PhoneNumberFormSearchField} Instance of {@link PhoneNumberFormSearchField} type.
     */
    getDigitsSearchField = () => {
        if (!this._digitsSearchField) {
            this._digitsSearchField = new PhoneNumberFormSearchField(
                this.getDigitsInput()
            );
        }

        return this._digitsSearchField;
    }

    /**
     * Toll free switcher.
     * @returns {HTMLDivElement} `HTMLDivElement` instance.
     */
    getTollFreeSwitcher = () => {
        /**
         * Some kind of lazy load implementation.
         * Once we call this method, it will remember the element
         * so we won't need to search it again over the entire document.
         */
        if (this._tollFreeSwitcher) {
            return this._tollFreeSwitcher;
        }

        const selector = ".switcher";
        const switcher = this.getForm().querySelectorAll(selector)[0];
        
        if (switcher instanceof HTMLDivElement) {
            this._tollFreeSwitcher = switcher;
            return switcher;
        } else {
            throw new Error(`${selector} is not an HTMLDivElement.`);
        }
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

        const selector = "input[type='submit']";
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
        this.setMenuExpandingOnFocus(true);
        this._queryHandler = undefined;
    }

    /**
     * @param {InputAutocompleteItem[]} items Autocomplete items.
     */
    setAutocompleteItems(items) {
        this.autocompleteItems = items;
        $(this.input).autocomplete({
            source: items.map(item => item.text)
        });
    }

    /**
     * @returns {InputAutocompleteItem | undefined} Instance of {@link InputAutocompleteItem} type or `undefined`.
     */
    getSelectedAutocompleteItem = () => {
        const currentValue = this.input.value;
        const autocompleteItems = this.autocompleteItems ?? [];
        return autocompleteItems.find(item => item.text === currentValue);
    }

    /**
     * @param {boolean} expanding 
     */
    setMenuExpandingOnFocus = (expanding) => {
        this._expandingMenuOnFocus = expanding;
        this.input.onfocus = this.input.onfocus = () => {
            if (this._expandingMenuOnFocus) {
                $(this.input).autocomplete("search", this.input.value);
            }
        };
    }

    startObserving = () => {
        const valueObserver = new InputValueObserver(this.input);
        valueObserver.startObserving((newValue) => {
            console.log(`Observed input value: ${newValue}`);
            if (this._queryHandler) {
                console.log(`Sending request for input value: ${newValue}`);
                this._queryHandler(newValue, (autocompleteItems) => {
                    this.setAutocompleteItems(
                        autocompleteItems
                    );
                });
            } else {
                this.setAutocompleteItems([]);
            }
        });
        this.valueObserver = valueObserver;
    }

    stopObserving = () => {
        if (this.valueObserver) {
            this.valueObserver.stopObserving();
            this.valueObserver = undefined;
        }
    }

    /**
     * @param {(query: string, response: (autocompleteItems: InputAutocompleteItem[]) => void) => void} handler 
     */
    onQuery = (handler) => {
        this._queryHandler = handler;
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
            <div class="phone-number">
                <div class="columns-8 w-row">
                    <div class="column-9 w-col w-col-2">
                        <div class="div-block-11">
                        </div>
                    </div>
                    <div class="w-col w-col-5">
                        <div class="txt-phone-number">
                            ${this.phone}
                        </div>
                    </div>
                    <div class="w-col w-col-5">
                        <div class="txt-lacation">
                            ${this.city}, ${this.stateCode}
                        </div>
                    </div>
                </div>
            </div>
            <div class="devider-8px">
            </div>
        `;
    }
}
const ChooseBusinessNumber_PageConfiguration = Object.freeze({
    minimumCityLengthForSearch: 3,
    minimumAreaCodeLengthForSearch: 0,
    phoneNumbersCountForPage: 10
});

$(document).ready(() => {

    var lastRefreshSuggestedNumbersRequest = undefined;

    const refreshAutocompleteItems = () => {
        citySearchField.refreshAutocompleteItemsForValue(
            citySearchField.input.value,
            () => {
            }
        );
        areaCodeSearchField.refreshAutocompleteItemsForValue(
            areaCodeSearchField.input.value,
            () => {
            }
        );
    };

    const refreshSuggestedNumbers = () => {
        const cityInputData = formData.methods.parseCityInput(formData.input.city);

        if (lastRefreshSuggestedNumbersRequest) {
            lastRefreshSuggestedNumbersRequest.abort();
        }

        lastRefreshSuggestedNumbersRequest = PhoneNumberManager.getNumbers(
            formData.input.city,
            formData.input.state,
            formData.input.areaCode ?? "",
            formData.input.digits ?? "",
            formData.input.tollFreeOnly,
            (numbers, error) => {
                const columnItems = numbers
                    .slice(0, ChooseBusinessNumber_PageConfiguration.phoneNumbersCountForPage)
                    .map(phoneNumber => {
                        return new PhoneNumberFormColumnItem(
                            getFormattedPhoneNumber(phoneNumber.areaCode, phoneNumber.number),
                            phoneNumber.city,
                            phoneNumber.stateCode
                        );
                    });

                phoneNumberForm.getColumns().forEach(column => {
                    column.setItems([]);
                });

                var leftColumnItems = [], rightColumnItems = [];

                columnItems.forEach((item, index) => {
                    const order = index + 1;
                    const collection = (order % 2 == 0) ? rightColumnItems : leftColumnItems;
                    collection.push(item);
                });

                phoneNumberForm.getLeftColumn().setItems(
                    leftColumnItems
                );
                phoneNumberForm.getRightColumn().setItems(
                    rightColumnItems
                );

                formData.selectedPhoneNumber = undefined;
                UserInterface.setElementEnabled(
                    phoneNumberForm.getSubmitButton(),
                    false
                );
                
                $("div.phone-number")
                    .off("click")
                    .on("click", (event) => {
                        $("div.phone-number .div-radio-button").removeClass("radio-selected");

                        const selectedColumnItem = event.currentTarget;
                        $(selectedColumnItem).find(".div-radio-button").addClass("radio-selected");

                        UserInterface.setElementEnabled(
                            phoneNumberForm.getSubmitButton(),
                            true
                        );
                        
                        const selectedPhoneNumber = $(selectedColumnItem).attr("phone-number");
                        formData.selectedPhoneNumber = selectedPhoneNumber;

                        logger.print(`Selected number: ${selectedPhoneNumber}`);
                    });
                
                phoneNumberForm.setEmptyStateVisible(
                    !columnItems.length
                );
            }
        );
    };

    const handleFiltersChange = () => {
        logger.print("Handle filters change");

        refreshAutocompleteItems();
        refreshSuggestedNumbers();

        UserInterface.setElementEnabled(
            citySearchField.input,
            !formData.input.tollFreeOnly
        );

        phoneNumberForm.setLocationLinkVisible(
            !formData.input.tollFreeOnly
        );
    };

    /**
     * @param {string} areaCode 
     * @param {string} number 
     */
    const getFormattedPhoneNumber = (areaCode, number) => {
        const formattedDigits = (() => {
            if (number.length == 7) {
                return `${number.toString().substring(0, 3)}-${number.toString().substring(3, 7)}`;
            } else {
                return number.toString();
            }
        })();
        return `(${areaCode}) ${formattedDigits}`;
    };

    /**
     * Phone number form.
     */
    const phoneNumberForm = new PhoneNumberForm("form#wf-form-business-phone-number");
    phoneNumberForm.getColumns().forEach(column => {
        column.setItems([]);
    });

    /**
     * Here we store all temporary data related to the form.
     */
    const formData = {
        input: {
            city: "",
            state: "",
            areaCode: "",
            digits: "",
            tollFreeOnly: false
        },
        selectedPhoneNumber: undefined,
        methods: {
            parseCityInput: (value) => {
                var text = String(value);
                while (text.indexOf(" ") > -1) { text = text.replace(" ", ""); }
                const components = text.split(",");
                return {
                    city: components[0] ?? "",
                    stateCode: components[1] ?? ""
                };
            }
        }
    };
    
    /**
     * City field.
     */
    const citySearchField = phoneNumberForm.getCitySearchField()
        .onValueChanged((newValue) => {
            const parsedInput = formData.methods.parseCityInput(newValue);
            formData.input.city = parsedInput.city;
            formData.input.state = parsedInput.stateCode;
            handleFiltersChange();
        })
        .onQuery((query, response) => {
            refreshSuggestedNumbers();

            if (query.length < ChooseBusinessNumber_PageConfiguration.minimumCityLengthForSearch) {
                response([]);
                return undefined;
            } else {
                return PhoneNumberManager.getCities(
                    query,
                    (cities, error) => {
                        const autocompleteItems = cities.map(city => new InputAutocompleteItem(
                            `${city.name}, ${city.stateCode}`,
                            city.name
                        ));
                        response(
                            autocompleteItems
                        );
                    }
                );
            }
        })
        .refreshAutocompleteItemsAutomatically(false)
        .setMenuExpandingOnFocus(true)
        .startObserving();

    /**
     * Area code field.
     */
    const areaCodeSearchField = phoneNumberForm.getAreaCodeSearchField()
        .onValueChanged((newValue) => {
            formData.input.areaCode = newValue;
            handleFiltersChange();
        })
        .onQuery((query, response) => {
            refreshSuggestedNumbers();

            if (query.length < ChooseBusinessNumber_PageConfiguration.minimumAreaCodeLengthForSearch) {
                response([]);
                return undefined;
            } else {
                return PhoneNumberManager.getAreaCodes(
                    formData.input.city,
                    formData.input.state,
                    formData.input.tollFreeOnly,
                    (areaCodes, error) => {
                        logger.print(`Available area codes: `, areaCodes);
                        const autocompleteItems = areaCodes.map(areaCode => new InputAutocompleteItem(
                            areaCode,
                            areaCode
                        ));
                        response(
                            autocompleteItems
                        );
                    }
                )
            }
        })
        .refreshAutocompleteItemsAutomatically(false)
        .setMenuExpandingOnFocus(true)
        .startObserving();

    /**
     * Digits field.
     */
    const digitsInput = phoneNumberForm.getDigitsInput();
    digitsInput.oninput = () => {
        formData.input.digits = digitsInput.value;
        logger.print(`Digits: ${formData.input.digits}`);
        handleFiltersChange();
    };

    /**
     * Toll free switcher.
     */
    const tollFreeSwitcher = phoneNumberForm.getTollFreeSwitcher()
        .setOn(formData.input.tollFreeOnly)
        .startWatchingForStateChanges((switcher) => {
            formData.input.tollFreeOnly = switcher.isOn();
            logger.print(`Toll free only: ${switcher.isOn()}`);
            handleFiltersChange();
        });
    
    /**
     * Location link.
     */
    const locationLink = phoneNumberForm.getLocationLink();

    $(locationLink).on("click", (event) => {
        /**
         * Fill city search field with a suggested location by clicking the link.
         */
        citySearchField.input.value = locationLink.innerText;
    });

    PhoneNumberManager.getUserLocation((city, error) => {
        if (city && !error) {
            $(locationLink).html(`${city.name}, ${city.stateCode}`);
        }
    });

    /**
     * Here we handle submit button click.
     */
    const submitButton = document.querySelectorAll("#submit-button")[0];
    $(submitButton).on("click", () => {
        Store.local.write(
            Store.keys.businessFlow.selectedNumber,
            formData.selectedPhoneNumber
        );
    });

    $(phoneNumberForm.getForm()).submit(() => {
        return formData.selectedPhoneNumber != undefined;
    });

    /**
     * Offer some numbers when page is loaded.
     */
    refreshSuggestedNumbers();

    /**
     * Disable submit button by default.
     */
    UserInterface.setElementEnabled(
        phoneNumberForm.getSubmitButton(),
        false
    );
});
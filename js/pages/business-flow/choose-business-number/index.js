const IndexConfiguration = Object.freeze({
    minimumCityLengthForSearch: 3,
    minimumAreaCodeLengthForSearch: 0
});

$(document).ready(() => {

    const phoneNumberForm = new PhoneNumberForm("form#wf-form-business-phone-number");
    phoneNumberForm.getColumns().forEach(column => {
        column.setItems([]);
    });

    const formData = {
        input: {
            city: "",
            areaCode: "",
            digits: ""
        },
        methods: {
            parseCityInput: () => {
                var input = formData.input.city;
                while (input.indexOf(" ") > -1) { input = input.replace(" ", ""); }
                const components = input.split(",");
                return {
                    city: components[0],
                    stateCode: components[1]
                };
            },

            updateNumbers: () => {
                const cityInputData = formData.methods.parseCityInput();

                PhoneNumberManager.getNumbers(
                    cityInputData.city,
                    cityInputData.stateCode,
                    formData.input.areaCode,
                    formData.input.digits,
                    (numbers, error) => {
                        console.log(`Received ${numbers.length} numbers: ${numbers.map(number => number.number)}`);
                    }
                )
            }
        }
    };
    
    const citySearchField = phoneNumberForm.getCitySearchField()
        .onQuery((query, response) => {
            formData.input.city = query;
            areaCodeSearchField.refreshAutocompleteItemsForValue(formData.input.areaCode);
            formData.methods.updateNumbers();

            if (query.length < IndexConfiguration.minimumCityLengthForSearch) {
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
        .setMenuExpandingOnFocus(true)
        .startObserving();

    const areaCodeSearchField = phoneNumberForm.getAreaCodeSearchField()
        .onQuery((query, response) => {
            formData.input.areaCode = query;
            citySearchField.refreshAutocompleteItemsForValue(formData.input.city);
            formData.methods.updateNumbers();

            if (query.length < IndexConfiguration.minimumAreaCodeLengthForSearch) {
                response([]);
                return undefined;
            } else {
                const parsedInputData = formData.methods.parseCityInput();
                const cityName = parsedInputData.city;
                const stateCode = parsedInputData.stateCode;
                console.log(`Parsed: `, parsedInputData);
                return PhoneNumberManager.getAreaCodes(
                    cityName,
                    stateCode,
                    (areaCodes, error) => {
                        console.log(`Available area codes: `, areaCodes);
                        const autocompleteItems = areaCodes.map(areaCode => new InputAutocompleteItem(
                            `${areaCode} ${stateCode.toUpperCase()}`,
                            areaCode
                        ));
                        response(
                            autocompleteItems
                        );
                    }
                )
            }
        })
        .setMenuExpandingOnFocus(true)
        .startObserving();

    const digitsInput = phoneNumberForm.getDigitsInput();
    digitsInput.oninput = () => {
        formData.input.digits = digitsInput.value;
        console.log(`Digits: ${formData.input.digits}`);
    };
});
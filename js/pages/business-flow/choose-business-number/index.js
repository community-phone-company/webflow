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
        lastCityFilterRequest: undefined,
        lastAreaCodeFilterRequest: undefined,
        methods: {
            parseCityInput = () => {
                var input = formData.input.city;
                while (input.indexOf(" ") > -1) { input = input.replace(" ", ""); }
                const components = input.split(",");
                return {
                    city: components[0],
                    stateCode: components[1]
                };
            }
        }
    };
    
    const citySearchField = phoneNumberForm.getCitySearchField();
    citySearchField.onQuery((query, response) => {
        formData.city = query;

        if (formData.lastCityFilterRequest) {
            formData.lastCityFilterRequest.abort();
            formData.lastCityFilterRequest = undefined;
        }

        if (query.length < IndexConfiguration.minimumCityLengthForSearch) {
            response([]);
        } else {
            formData.lastCityFilterRequest = PhoneNumberManager.getCities(
                query,
                (cities, error) => {
                    const autocompleteItems = cities.map(city => new InputAutocompleteItem(
                        `${city.name}, ${city.stateCode}`,
                        city
                    ));
                    response(
                        autocompleteItems
                    );
                }
            );
        }
    });
    citySearchField.startObserving();

    const areaCodeSearchField = phoneNumberForm.getAreaCodeSearchField();
    areaCodeSearchField.onQuery((query, response) => {
        formData.input.areaCode = query;

        if (formData.lastAreaCodeFilterRequest) {
            formData.lastAreaCodeFilterRequest.abort();
            formData.lastAreaCodeFilterRequest = undefined;
        }

        if (query.length < IndexConfiguration.minimumAreaCodeLengthForSearch) {
            response([]);
        } else {
            //const selectedCity = citySearchField.getSelectedAutocompleteItem().value;
            //const cityName = selectedCity ? selectedCity.name : "";
            //const stateCode = selectedCity ? selectedCity.stateCode : "";
            const parsedInputData = formData.methods.parseCityInput();
            const cityName = parsedInputData.city;
            const stateCode = parsedInputData.stateCode;
            formData.lastAreaCodeFilterRequest = PhoneNumberManager.getAreaCodes(
                cityName,
                stateCode,
                (areaCodes, error) => {
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
    });
    areaCodeSearchField.startObserving();

    const digitsInput = phoneNumberForm.getDigitsInput();
    digitsInput.oninput = () => {
        formData.input.digits = digitsInput.value;
        console.log(`Digits: ${formData.input.digits}`);
    };
});
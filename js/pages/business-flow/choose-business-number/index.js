const IndexConfiguration = Object.freeze({
    minimumCityLengthForSearch: 3,
    minimumAreaCodeLengthForSearch: 3
});

$(document).ready(() => {

    const phoneNumberForm = new PhoneNumberForm("form#wf-form-business-phone-number");
    phoneNumberForm.getColumns().forEach(column => {
        column.setItems([]);
    });

    const formData = {
        city: "",
        lastCityFilterRequest: undefined,
        areaCode: "",
        lastAreaCodeFilterRequest: undefined,
        digits: ""
    };
    
    const citySearchField = phoneNumberForm.getCitySearchField();
    citySearchField.onQuery((query, response) => {
        formData.city = query;

        if (formData.lastCityFilterRequest) {
            formData.lastCityFilterRequest.abort();
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
        formData.areaCode = query;

        if (formData.lastAreaCodeFilterRequest) {
            formData.lastAreaCodeFilterRequest.abort();
        }

        if (query.length < IndexConfiguration.minimumAreaCodeLengthForSearch) {
            response([]);
        } else {
            const selectedCity = citySearchField.getSelectedAutocompleteItem().value;
            const cityName = selectedCity ? selectedCity.name : "";
            const stateCode = selectedCity ? selectedCity.stateCode : "";
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
        formData.digits = digitsInput.value;
        console.log(`Digits: ${formData.digits}`);
    };
});
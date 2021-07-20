const minimumCityLengthForSearch = 3;

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

        if (formData.city.length < minimumCityLengthForSearch) {
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

        // TODO: Implement request to endpoint here.
        response([]);
    });
    areaCodeSearchField.startObserving();

    const digitsInput = phoneNumberForm.getDigitsInput();
    digitsInput.oninput = () => {
        formData.digits = digitsInput.value;
        console.log(`Digits: ${formData.digits}`);
    };
});
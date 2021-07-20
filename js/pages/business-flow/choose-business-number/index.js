const minimumCityLengthForSearch = 3;

$(document).ready(() => {

    const phoneNumberForm = new PhoneNumberForm("form#wf-form-business-phone-number");
    phoneNumberForm.getColumns().forEach(column => {
        column.setItems([]);
    });

    const formData = {
        city: "",
        areaCode: "",
        digits: ""
    };

    var lastCityFilterRequest = undefined;
    
    const citySearchField = phoneNumberForm.getCitySearchField();
    citySearchField.onQuery((query, response) => {
        formData.city = query;

        if (lastCityFilterRequest) {
            lastCityFilterRequest.abort();
        }

        if (formData.city.length < minimumCityLengthForSearch) {
            response([]);
        } else {
            lastCityFilterRequest = PhoneNumberManager.getCities(
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

    const areaCodeInput = phoneNumberForm.getAreaCodeInput();
    areaCodeInput.oninput = () => {
        formData.areaCode = areaCodeInput.value;
        console.log(`Area code: ${formData.areaCode}`);
    };

    const digitsInput = phoneNumberForm.getDigitsInput();
    digitsInput.oninput = () => {
        formData.digits = digitsInput.value;
        console.log(`Digits: ${formData.digits}`);
    };
});

HTMLInputElement.subscribeForValueChanges = () => {
    setInterval(() => {
    }, 10);
};
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
    
    const cityInput = phoneNumberForm.getCityInput();
    
    //cityInput.oninput = () => {
    new InputValueObserver(cityInput).startObserving((cityInput) => {
        formData.city = cityInput.value;
        console.log(`City: ${formData.city}`);

        if (lastCityFilterRequest) {
            lastCityFilterRequest.abort();
        }

        if (formData.city.length < minimumCityLengthForSearch) {
            phoneNumberForm.setCityInputAutocompleteItems([]);
        } else {
            lastCityFilterRequest = PhoneNumberManager.getCities(
                formData.city,
                (cities, error) => {
                    const autocompleteItems = cities.map(city => new InputAutocompleteItem(
                        `${city.name}, ${city.stateCode}`,
                        `${city.name}, ${city.stateCode}`
                    ));
                    phoneNumberForm.setCityInputAutocompleteItems(
                        autocompleteItems
                    );
                }
            );
        }
    });

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
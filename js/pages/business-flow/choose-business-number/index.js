const minimumCityLengthForSearch = 3;

$(document).ready(() => {

    const phoneNumberForm = new PhoneNumberForm("form#wf-form-business-phone-number");
    phoneNumberForm.getColumns().forEach(column => {
        column.setItems([]);
    });

    const formData = {
        city: "",
        filteredCities: [],
        areaCode: "",
        digits: ""
    };

    var lastCitiesRequest = undefined;
    
    const cityInput = phoneNumberForm.getCityInput();
    cityInput.oninput = () => {
        formData.city = cityInput.value;
        console.log(`City: ${formData.city}`);

        if (lastCitiesRequest) {
            lastCitiesRequest.abort();
        }

        if (formData.city.length < minimumCityLengthForSearch) {
            phoneNumberForm.setCityInputAutocompleteItems([]);
        } else {
            lastCitiesRequest = PhoneNumberManager.getCities(
                formData.city,
                (cities, error) => {
                    formData.filteredCities = cities;
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
    };

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
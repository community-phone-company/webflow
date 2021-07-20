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

        lastCitiesRequest = PhoneNumberManager.getCities(
            formData.city,
            (cities, error) => {
                formData.filteredCities = cities;
                $(cityInput).autocomplete({
                    source: cities.map(city => `${city.name}, ${city.stateCode}`)
                });
            }
        );
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
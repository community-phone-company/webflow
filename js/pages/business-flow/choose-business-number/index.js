$(document).ready(() => {

    const phoneNumberForm = new PhoneNumberForm("form#wf-form-business-phone-number");
    phoneNumberForm.getColumns().forEach(column => {
        column.setItems([]);
    });

    const fillColumnsWithTestNumbers = (city, areaCode, digits) => {
        phoneNumberForm.getColumns().forEach(column => {
            column.setItems(
                [0, 1, 2, 3, 4]
                    .map(el => `(${el}${el}${el}) ${el}${el}${el}-${el}${el}${el}${el}`)
                    .map(el => new PhoneNumberFormColumnItem(el, city, "CA"))
            );
        });
    };

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
        
        //fillColumnsWithTestNumbers(formData.city, areaCode, digits);

        if (lastCitiesRequest) {
            lastCitiesRequest.abort();
        }

        lastCitiesRequest = PhoneNumberManager.getCities(
            formData.city,
            (cities, error) => {
                formData.filteredCities = cities;
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
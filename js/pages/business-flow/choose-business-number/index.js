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
                    .map(el => new PhoneNumberFormColumnItem(el, "Cupertino", "CA"))
            );
        });
    };
    
    const cityInput = phoneNumberForm.getCityInput();
    var city = "";
    cityInput.oninput = () => {
        city = cityInput.value;
        console.log(`City: ${city}`);
        fillColumnsWithTestNumbers(city, areaCode, digits);
    };

    const areaCodeInput = phoneNumberForm.getAreaCodeInput();
    var areaCode = "";
    areaCodeInput.oninput = () => {
        areaCode = areaCodeInput.value;
        console.log(`Area code: ${areaCode}`);
    };

    const digitsInput = phoneNumberForm.getDigitsInput();
    var digits = "";
    digitsInput.oninput = () => {
        digits = digitsInput.value;
        console.log(`Digits: ${digits}`);
    };
});
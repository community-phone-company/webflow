class CheckoutSessionDataMaker {

    /**
     * @param {"step_one" | "step_two" | "step_three" | "step_four"} stepName 
     * @param {any} data 
     * @returns 
     */
    stepWithData(stepName, data) {
        return {
            [stepName]: data
        };
    }

    /**
     * @param {"residential" | "business" | undefined} landlineService 
     * @param {string | undefined} addressLineOne 
     * @param {string | undefined} addressLineTwo 
     * @param {string | undefined} city 
     * @param {string | undefined} zip 
     * @param {string | undefined} stateCode 
     * @returns
     */
    stepOne(
        landlineService,
        addressLineOne,
        addressLineTwo,
        city,
        zip,
        stateCode
    ) {
        return {
            "step_one": {
                "landline_service": landlineService,
                "address_line_one": addressLineOne,
                "address_line_two": addressLineTwo,
                "city": city,
                "zip": zip,
                "state_code": stateCode
            }
        };
    }

    /**
     * @param {string | undefined} selectedPhoneNumber 
     * @param {"selected-number" | "port-existing-number" | undefined} phoneNumberService 
     * @param {string[] | undefined} selectedProducts 
     * @param {string | undefined} porting_technicalData_carrierName 
     * @param {string | undefined} porting_technicalData_accountName 
     * @param {string | undefined} porting_technicalData_numberToPort 
     * @param {string | undefined} porting_technicalData_accountNumber 
     * @param {string | undefined} porting_technicalData_pin 
     * @param {string | undefined} porting_serviceAddress_firstName 
     * @param {string | undefined} porting_serviceAddress_lastName 
     * @param {string | undefined} porting_serviceAddress_addressLineOne 
     * @param {string | undefined} porting_serviceAddress_city 
     * @param {string | undefined} porting_serviceAddress_state 
     * @param {string | undefined} porting_serviceAddress_zip 
     * @returns 
     */
    stepTwo(
        selectedPhoneNumber,
        phoneNumberService,
        selectedProducts,
        porting_technicalData_carrierName,
        porting_technicalData_accountName,
        porting_technicalData_numberToPort,
        porting_technicalData_accountNumber,
        porting_technicalData_pin,
        porting_serviceAddress_firstName,
        porting_serviceAddress_lastName,
        porting_serviceAddress_addressLineOne,
        porting_serviceAddress_city,
        porting_serviceAddress_state,
        porting_serviceAddress_zip
    ) {
        return {
            "step_two": {
                "selected_phonenumber": selectedPhoneNumber,
                "phonenumber_service": phoneNumberService,
                "selected_products": selectedProducts,
                "porting_data": {
                    "technical_data": {
                        "carrier_name": porting_technicalData_carrierName,
                        "account_name": porting_technicalData_accountName,
                        "number_to_port": porting_technicalData_numberToPort,
                        "account_number": porting_technicalData_accountNumber,
                        "pin": porting_technicalData_pin
                    },
                    "service_address": {
                        "first_name": porting_serviceAddress_firstName,
                        "last_name": porting_serviceAddress_lastName,
                        "address_line_one": porting_serviceAddress_addressLineOne,
                        "city": porting_serviceAddress_city,
                        "state": porting_serviceAddress_state,
                        "zip": porting_serviceAddress_zip
                    }
                }
            }
        };
    }

    /**
     * @param {string | undefined} firstName 
     * @param {string | undefined} lastName 
     * @param {string | undefined} phone 
     * @param {string | undefined} email 
     * @param {string | undefined} howDidTheyHearAboutUs 
     * @returns 
     */
    stepThree(
        firstName,
        lastName,
        phone,
        email,
        howDidTheyHearAboutUs
    ) {
        return {
            "step_three": {
                "first_name": firstName,
                "last_name": lastName,
                "phone": phone,
                "email": email,
                "how_did_they_hear_about_us": howDidTheyHearAboutUs
            }
        };
    }

    /**
     * @param {string | undefined} shippingAddress_firstName 
     * @param {string | undefined} shippingAddress_lastName 
     * @param {string | undefined} shippingAddress_email 
     * @param {string | undefined} shippingAddress_phone 
     * @param {string | undefined} shippingAddress_addressLineOne 
     * @param {string | undefined} shippingAddress_addressLineTwo 
     * @param {string | undefined} shippingAddress_stateCode 
     * @param {string | undefined} shippingAddress_city 
     * @param {string | undefined} shippingAddress_zip 
     * @param {string | undefined} billingAddress_firstName 
     * @param {string | undefined} billingAddress_lastName 
     * @param {string | undefined} billingAddress_email 
     * @param {string | undefined} billingAddress_phone 
     * @param {string | undefined} billingAddress_addressLineOne 
     * @param {string | undefined} billingAddress_addressLineTwo 
     * @param {string | undefined} billingAddress_stateCode 
     * @param {string | undefined} billingAddress_city 
     * @param {string | undefined} billingAddress_zip 
     * @param {string | undefined} cardNumber 
     * @param {string | undefined} cardExpiryMonth 
     * @param {string | undefined} cardExpiryYear 
     * @param {string | undefined} cardControlValue 
     * @returns 
     */
    stepFour(
        shippingAddress_firstName,
        shippingAddress_lastName,
        shippingAddress_email,
        shippingAddress_phone,
        shippingAddress_addressLineOne,
        shippingAddress_addressLineTwo,
        shippingAddress_stateCode,
        shippingAddress_city,
        shippingAddress_zip,
        billingAddress_firstName,
        billingAddress_lastName,
        billingAddress_email,
        billingAddress_phone,
        billingAddress_addressLineOne,
        billingAddress_addressLineTwo,
        billingAddress_stateCode,
        billingAddress_city,
        billingAddress_zip,
        cardNumber,
        cardExpiryMonth,
        cardExpiryYear,
        cardControlValue
    ) {
        return {
            "step_four": {
                "shipping_address": {
                    "first_name": shippingAddress_firstName,
                    "last_name": shippingAddress_lastName,
                    "email": shippingAddress_email,
                    "phone": shippingAddress_phone,
                    "line1": shippingAddress_addressLineOne,
                    "line2": shippingAddress_addressLineTwo,
                    "state_code": shippingAddress_stateCode,
                    "city": shippingAddress_city,
                    "zip": shippingAddress_zip
                },
                "billing_address": {
                    "first_name": billingAddress_firstName,
                    "last_name": billingAddress_lastName,
                    "email": billingAddress_email,
                    "phone": billingAddress_phone,
                    "line1": billingAddress_addressLineOne,
                    "line2": billingAddress_addressLineTwo,
                    "state_code": billingAddress_stateCode,
                    "city": billingAddress_city,
                    "zip": billingAddress_zip
                },
                "card": {
                    "card_number": cardNumber,
                    "card_expiry_month": cardExpiryMonth,
                    "card_expiry_year": cardExpiryYear,
                    "card_cvv": cardControlValue
                }
            }
        };
    }
}
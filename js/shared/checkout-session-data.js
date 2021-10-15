class CheckoutSessionDataMaker {

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
            "landline_service": landlineService,
            "address_line_one": addressLineOne,
            "address_line_two": addressLineTwo,
            "city": city,
            "zip": zip,
            "state_code": stateCode
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
        };
    }
}
class ChargebeeCheckoutCustomer {

    /**
     * @constructor
     * @param {string} firstName First name.
     * @param {string} lastName Last name.
     * @param {string} email Email.
     * @param {string} phone Phone.
     * @param {string} subscriberType Subscriber type. Use values from {@link ChargebeeCheckoutSubscriberType}.
     * @param {boolean} selfCheckout If `true`, user is going to create new order via website. Otherwise, salesperson is going to create the order.
     * @param {string | undefined} howDidTheyHearAboutUs How did they hear about us.
     */
    constructor(firstName, lastName, email, phone, subscriberType, selfCheckout, howDidTheyHearAboutUs) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.customerType = subscriberType;
        this.selfCheckout = selfCheckout;
        this.howDidTheyHearAboutUs = howDidTheyHearAboutUs;
    }
}

const ChargebeeCheckoutSubscriberType = Object.freeze({
    home: "residential",
    business: "business"
});

const ChargebeeCheckoutPhoneNumberServiceType = Object.freeze({
    portExistingNumber: "port-existing-number",
    getNewNumber: "new-number",
    selectedNumber: "selected-number"
});

class ChargebeeCheckoutPortingData {

    /**
     * @constructor
     * @param {string} carrierName 
     * @param {string} accountName 
     * @param {string} numberToPort 
     * @param {string} accountNumber 
     * @param {string} pin 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} addressLineOne 
     * @param {string} addressLineTwo 
     * @param {string} city 
     * @param {string} state 
     * @param {string} zip 
     */
    constructor(carrierName, accountName, numberToPort, accountNumber, pin, firstName, lastName, addressLineOne, addressLineTwo, city, state, zip) {
        this.carrierName = carrierName;
        this.accountName = accountName;
        this.numberToPort = numberToPort;
        this.accountNumber = accountNumber;
        this.pin = pin;
        this.firstName = firstName;
        this.lastName = lastName;
        this.addressLineOne = addressLineOne;
        this.addressLineTwo = addressLineTwo;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }
}

class ChargebeeCheckoutAddress {

    /**
     * @constructor
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} email 
     * @param {string} phone 
     * @param {string} line1 
     * @param {string} line2 
     * @param {string} stateCode 
     * @param {string} city 
     * @param {string} zip 
     */
    constructor(
        firstName,
        lastName,
        email,
        phone,
        line1,
        line2,
        stateCode,
        city,
        zip
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.line1 = line1;
        this.line2 = line2;
        this.stateCode = stateCode;
        this.city = city;
        this.zip = zip;
    }
}

class ChargebeeCheckoutCardInformation {

    /**
     * @constructor
     * @param {string} number Card number.
     * @param {ChargebeeCheckoutCardInformationExpiryDate} expiry Expiry date.
     * @param {string} verificationValue Verification value.
     */
    constructor(number, expiry, verificationValue) {
        this.number = number;
        this.expiry = expiry;
        this.verificationValue = verificationValue;
    }
}

class ChargebeeCheckoutCardInformationExpiryDate {

    /**
     * @param {string} date Date.
     * @returns `ChargebeeCheckoutCardInformationExpiryDate` instance.
     */
    static parse = (date) => {
        const components = date.split("/");

        const monthString = components[0];
        const month = Number.parseInt(monthString);
        
        const yearString = components[1];
        const year = Number.parseInt(yearString);

        return new ChargebeeCheckoutCardInformationExpiryDate(
            month,
            year
        );
    }

    /**
     * @constructor
     * @param {number} month Month.
     * @param {number} year Year.
     */
    constructor(month, year) {
        this.month = month;
        this.year = year;
    }
}

const ChargebeePaymentStatus = Object.freeze({
    pending: "pending",
    notPaid: "not-paid",
    paid: "paid"
});

class Chargebee {

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * @param {ChargebeeCheckoutCustomer} customer Customer.
     * @param {string} serviceType Service type.
     * @param {ChargebeeCheckoutPortingData | undefined} portingData Porting data.
     * @param {ChargebeeCheckoutAddress} shippingAddress Shipping address.
     * @param {ChargebeeCheckoutAddress} billingAddress Billing address.
     * @param {string[]} productIdentifiers Product identifiers.
     * @param {string | undefined} selectedPhoneNumber Selected phone number.
     * @param {ChargebeeCheckoutCardInformation} cardInformation Card information.
     * @param {(message: string, subscriptionIdentifier: string | undefined, success: boolean) => void} callback Function that is called when result comes from the server.
     */
    checkout = (
        customer,
        serviceType,
        portingData,
        shippingAddress,
        billingAddress,
        productIdentifiers,
        selectedPhoneNumber,
        cardInformation,
        callback
    ) => {
        let data = {
            "first_name": customer.firstName,
            "last_name": customer.lastName,
            "email": customer.email,
            "phonenumber": customer.phone,
            "subscriber_type": customer.customerType,
            "self_checkout": customer.selfCheckout,
            "how_did_they_hear_about_us": customer.howDidTheyHearAboutUs,
            "phonenumber_service": serviceType,
            "porting_data": (() => {
                if (portingData) {
                    return {
                        "technical_data": {
                            "carrier_name": portingData.carrierName,
                            "account_name": portingData.accountName,
                            "number_to_port": portingData.numberToPort,
                            "account_number": portingData.accountNumber,
                            "pin": portingData.pin
                        },
                        "service_address": {
                            "first_name": portingData.firstName,
                            "last_name": portingData.lastName,
                            "address_line_one": portingData.addressLineOne,
                            "address_line_two": portingData.addressLineTwo,
                            "city": portingData.city,
                            "state": portingData.state,
                            "zip": portingData.zip
                        }
                    };
                } else {
                    return undefined;
                }
            })(),
            "billing_address": {
                "first_name": billingAddress.firstName,
                "last_name": billingAddress.lastName,
                "email": billingAddress.email,
                "phone": billingAddress.phone,
                "line1": billingAddress.line1,
                "line2": billingAddress.line2,
                "state_code": billingAddress.stateCode,
                "city": billingAddress.city,
                "zip": billingAddress.zip
            },
            "shipping_address": {
                "first_name": shippingAddress.firstName,
                "last_name": shippingAddress.lastName,
                "email": shippingAddress.email,
                "phone": shippingAddress.phone,
                "line1": shippingAddress.line1,
                "line2": shippingAddress.line2,
                "state_code": shippingAddress.stateCode,
                "city": shippingAddress.city,
                "zip": shippingAddress.zip
            },
            "subscription_plans": productIdentifiers.map(id => {
                return {
                    "item_price_id": id
                };
            }),
            "selected_phonenumber": selectedPhoneNumber,
            "card": {
                "card_number": cardInformation.number,
                "card_expiry_month": cardInformation.expiry.month,
                "card_expiry_year": cardInformation.expiry.year,
                "card_cvv": cardInformation.verificationValue
            }
        };
        console.log(data);
        const api = CommunityPhoneAPI.currentEnvironmentWithDefaultVersion();
        return api.jsonRequest(
            CommunityPhoneAPI.endpoints.chargebee_checkout,
            "POST",
            undefined,
            data,
            (response, error) => {
                if (error) {
                    const message = (() => {
                        const defaultMessage = "Something went wrong.\nTry again later or call us at (855) 615-0667";
                        return api.getErrorMessage(error, true) ?? api.getErrorMessage(error, false) ?? defaultMessage;
                    })();
                    callback(
                        message,
                        undefined,
                        false
                    );
                } else {
                    const message = response && response.message;
                    const subscriptionIdentifier = response && response.subscription_id;
                    callback(
                        message,
                        subscriptionIdentifier,
                        true
                    );
                }
            }
        );
    }

    /**
     * @param {string} subscriptionIdentifier 
     * @param {(status: string | undefined, message: string | undefined) => void} callback 
     */
    checkPaymentStatus = (
        subscriptionIdentifier,
        callback
    ) => {
        const api = CommunityPhoneAPI.currentEnvironmentWithDefaultVersion();
        return api.jsonRequest(
            CommunityPhoneAPI.endpoints.chargebee_checkPaymentStatus(
                subscriptionIdentifier
            ),
            "GET",
            undefined,
            undefined,
            (response, error) => {
                if (error) {
                    const message = (() => {
                        const defaultMessage = "Something went wrong.\nTry again later or call us at (855) 615-0667";
                        return api.getErrorMessage(error, true) ?? api.getErrorMessage(error, false) ?? defaultMessage;
                    })();
                    callback(
                        undefined,
                        message
                    );
                } else {
                    const status = response && response.status;
                    const message = response && response.message;
                    callback(
                        status,
                        message
                    );
                }
            }
        );
    }
}
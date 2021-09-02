class ChargebeeCheckoutCustomer {

    /**
     * @constructor
     * @param {string} firstName First name.
     * @param {string} lastName Last name.
     * @param {string} email Email.
     * @param {string} phone Phone.
     * @param {string} customerType Customer type. Use values from {@link ChargebeeCheckoutCustomerType}.
     */
    constructor(firstName, lastName, email, phone, customerType) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.customerType = customerType;
    }
}

const ChargebeeCheckoutCustomerType = Object.freeze({
    business: "business"
});

const ChargebeeCheckoutPhoneNumberServiceType = Object.freeze({
    portExistingNumber: "Port Existing Number",
    getNewNumber: "New Number"
});

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

class Chargebee {

    /**
     * @constructor
     * @param {boolean} isProduction
     */
    constructor(isProduction) {
        this.isProduction = isProduction;
    }

    /**
     * @param {ChargebeeCheckoutCustomer} customer Customer.
     * @param {string} serviceType Service type.
     * @param {ChargebeeCheckoutAddress} shippingAddress Shipping address.
     * @param {ChargebeeCheckoutAddress} billingAddress Billing address.
     * @param {string[]} productIdentifiers Product identifiers.
     * @param {ChargebeeCheckoutCardInformation} cardInformation Card information.
     * @param {(message: string, success: boolean) => void} callback Function that is called when result comes from the server.
     */
    checkout = (
        customer,
        serviceType,
        shippingAddress,
        billingAddress,
        productIdentifiers,
        cardInformation,
        callback
    ) => {
        const url = this.isProduction
            ? "https://landline.phone.community/api/v1/chargebee/checkout/"
            : "https://staging-landline.phone.community/api/v1/chargebee/checkout/";
        let data = {
            "first_name": customer.firstName,
            "last_name": customer.lastName,
            "email": customer.email,
            "phonenumber": customer.phone,
            "customer_type": customer.customerType,
            "phonenumber_service": serviceType,
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
            "card": {
                "card_number": cardInformation.number,
                "card_expiry_month": cardInformation.expiry.month,
                "card_expiry_year": cardInformation.expiry.year,
                "card_cvv": cardInformation.verificationValue
            }
        };
        console.log(data);
        $.ajax({
            url: url,
            method: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                const message = response && response.message;
                callback(
                    message,
                    true
                );
            },
            error: function (error) {
                const message = (() => {
                    const defaultMessage = "Something went wrong.\nTry again later or call us at (855) 615-0667";
                    return error && error.responseJSON && (error.responseJSON.message_html || error.responseJSON.message || defaultMessage);
                })();
                callback(
                    message,
                    false
                );
            }
        });
    }
}
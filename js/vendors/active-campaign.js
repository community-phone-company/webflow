/**
 * Class made for a simple integration of Active Campaign functionality.
 */
class ActiveCampaignIntegration {

    /**
     * Creates or updates existing contact.
     * Active Campaign API reference: https://developers.activecampaign.com/reference#create-or-update-contact-new
     * @param {ActiveCampaignContact} contact Contact data.
     * @param {(response: any, error: any, success: boolean) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest} Request instance.
     */
    static createOrUpdateContact = (contact, callback) => {
        const url = "https://communityphone52268.api-us1.com/api/3/contact/sync";
        const data = {
            "contact": contact.toJSON()
        };
        return $.ajax({
            url: url,
            method: "POST",
            headers: acth()["_0x1b8a9b"],
            crossDomain: true,
            dataType: "json",
            data: data,
            success: function (response) {
                callback(
                    response,
                    undefined,
                    true
                );
            },
            error: function (error) {
                console.log(error);
                callback(
                    undefined,
                    error,
                    false
                );
            }
        });
    }
}

class ActiveCampaignContact {

    /**
     * @constructor
     * @param {string | undefined} email String containing contact's email.
     * @param {string | undefined} firstName String containing contact's first name.
     * @param {string | undefined} lastName String containing contact's last name.
     * @param {string | undefined} phone String containing contact's phone.
     * @param {ActiveCampaignContactCustomField[]} fields Array of custom fields.
     */
    constructor(email, firstName, lastName, phone, fields) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.fields = fields;
    }

    /**
     * JSON object.
     * @returns {any}
     */
    toJSON = () => {
        var result = {};

        if (this.email) {
            result = {
                ...result,
                "email": this.email,
                
            };
        }

        if (this.firstName) {
            result = {}
        }

        return {
            ...this.email ? {"email": this.email} : undefined,
            ...this.firstName ? {"email": this.firstName} : undefined,
            ...this.lastName ? {"email": this.lastName} : undefined,
            ...this.phone ? {"email": this.phone} : undefined,
            ...this.fields.length ? {"fieldValues": this.fields.map(field => field.toJSON())} : undefined
        };
    }
}

class ActiveCampaignContactCustomField {

    /**
     * @constructor
     * @param {string} name Field's name.
     * @param {string} value Field's value.
     */
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    /**
     * JSON object.
     * @returns {any}
     */
    toJSON = () => {
        return {
            "field": this.name,
            "value": this.value
        };
    }
}
/**
 * Active Campaign list.
 */
class ActiveCampaignList {

    static chargebeeAbandonedCarts = () => {
        return new ActiveCampaignList(
            "Chargebee abandoned carts",
            "https://hooks.zapier.com/hooks/catch/10210393/b209e9x/"
        );
    }

    static landlineCheckCoverage = () => {
        return new ActiveCampaignList(
            "Landline check coverage",
            "https://hooks.zapier.com/hooks/catch/10210393/btggs2x/"
        );
    }

    static chooseNumber = () => {
        return new ActiveCampaignList(
            "Choose number",
            "https://hooks.zapier.com/hooks/catch/10558854/b2lg463/"
        );
    }

    /**
     * @constructor
     * @param {string} name List name.
     * @param {string} webhookUrl Zapier webhook URL.
     */
    constructor(name, webhookUrl) {
        this.name = name;
        this.webhookUrl = webhookUrl;
    }
}

/**
 * Class made for a simple integration of Active Campaign functionality.
 */
class ActiveCampaignIntegration {

    /**
     * Creates or updates existing contact.
     * Active Campaign API reference: https://developers.activecampaign.com/reference#create-or-update-contact-new
     * @param {ActiveCampaignContact} contact Contact data.
     * @param {ActiveCampaignList} list List.
     * @param {(response: any, error: any, success: boolean) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest | undefined} Request instance.
     */
    static createOrUpdateContact = (contact, list, callback) => {
        if (!(contact.email ?? "").length) {
            callback(
                undefined,
                new Error("Email is empty or undefined"),
                false
            );
            return undefined;
        }

        /*const data = {
            "contact": contact.toJSON()
        };*/
        const data = contact.toJSON();
        console.log(data);
        return $.ajax({
            url: list.webhookUrl,
            method: "POST",
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

    /**
     * Creates or updates existing contact using the custom JSON sent as request data.
     * Active Campaign API reference: https://developers.activecampaign.com/reference#create-or-update-contact-new
     * @param {any} json Custom JSON object containing request data.
     * @param {ActiveCampaignList} list List.
     * @param {(response: any, error: any, success: boolean) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest} Request instance.
     */
    static createOrUpdateContactWithJson = (json, list, callback) => {
        return $.ajax({
            url: list.webhookUrl,
            method: "POST",
            crossDomain: true,
            dataType: "json",
            data: json,
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
     * @param {ActiveCampaignContactCustomField[] | undefined} fields Array of custom fields.
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
        var json = {
            ...this.email ? {"email": this.email} : undefined,
            ...this.firstName ? {"firstName": this.firstName} : undefined,
            ...this.lastName ? {"lastName": this.lastName} : undefined,
            ...this.phone ? {"phone": this.phone} : undefined
        };

        if (this.fields) {
            const filteredFields = this.fields.filter(field => field.value != undefined);

            if (filteredFields.length) {
                filteredFields.forEach(field => {
                    json[field.name] = field.value;
                });
            }
        }

        return json;
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
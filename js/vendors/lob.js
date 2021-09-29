class LobIntegration {

    /**
     * @constructor
     * @param {boolean} isProduction 
     */
    constructor(isProduction) {
        this._apiKey = isProduction
            ? ""
            : "";
    }

    /**
     * @param {string} address
     * @param {(results: any[], error: any) => void} callback 
     */
    getAutocompletions = (address, callback) => {
        $.ajax({
            url: "https://api.lob.com/v1/us_autocompletions",
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(this._apiKey + ":")
            },
            dataType: "json",
            data: {
                "address_prefix": "185 B",
                "city": "San Francisco",
                "state": "CA",
                "zip_code": "94107",
                "geo_ip_sort": false
            },
            success: function (response) {
                console.log(`Response: `, response);
                const results = (() => {
                    if (response && response.suggestions && response.suggestions instanceof Array) {
                        return response.suggestions.map(el => {
                            return new LobAddressSuggestionResult(
                                el.primary_line,
                                el.city,
                                el.state,
                                el.zip_code
                            );
                        });
                    }

                    return [];
                })();
                callback(results, undefined);
            },
            error: function (error) {
                console.log(`Error: `, error);
                callback([], error);
            }
        });
    }
}

class LobAddressSuggestionResult {

    /**
     * @constructor
     * @param {string} primaryLine 
     * @param {string} city 
     * @param {string} state 
     * @param {string} zipCode 
     */
    constructor(
        primaryLine,
        city,
        state,
        zipCode
    ) {
        this.primaryLine = primaryLine;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
    }
}
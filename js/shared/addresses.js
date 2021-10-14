class AddressSuggestionsManager {

    /**
     * @constructor
     */
    constructor() {
        this._api = CommunityPhoneAPI.currentEnvironmentWithDefaultVersion();
    }

    /**
     * @param {string} address
     * @param {(results: AddressSuggestion[], error: any) => void} callback 
     */
    getAutocompletions = (address, callback) => {
        if (this._lastRequest) {
            this._lastRequest.abort();
        }

        this._lastRequest = this._api.jsonRequest(
            CommunityPhoneAPI.endpoints.search_addresses,
            "POST",
            undefined,
            {
                "address_prefix": address
            },
            (response, error) => {
                if (error) {
                    callback(
                        [],
                        error
                    );
                } else {
                    const results = (() => {
                        if (response && response.suggestions && response.suggestions instanceof Array) {
                            return response.suggestions.map(el => {
                                return new AddressSuggestion(
                                    el.primary_line,
                                    el.city,
                                    el.state,
                                    el.zip_code
                                );
                            });
                        }

                        return [];
                    })();
                    callback(
                        results,
                        undefined
                    );
                }
            }
        );
    }
}

class AddressSuggestion {

    /**
     * @param {string} serialized 
     * @returns {AddressSuggestion}
     */
    static deserialize = (serialized) => {
        const jsonString = atob(serialized);
        const json = JSON.parse(jsonString);
        return new AddressSuggestion(
            json.primaryLine,
            json.city,
            json.state,
            json.zipCode
        );
    }

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

    /**
     * @returns {string}
     */
    serialize = () => {
        const jsonString = JSON.stringify(this);
        return btoa(jsonString);
    }
}
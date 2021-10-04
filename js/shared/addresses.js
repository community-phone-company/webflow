class AddressSuggestionsManager {

    /**
     * @param {string} address
     * @param {(results: any[], error: any) => void} callback 
     */
    getAutocompletions = (address, callback) => {
        const api = CommunityPhoneAPI.currentEnvironmentWithLatestVersion();
        this._lastRequest = api.jsonRequest(
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
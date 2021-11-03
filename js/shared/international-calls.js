class CountryCallRate {

    /**
     * @param {any} json 
     */
    constructor(json) {
        this.countryName = json.name;
        this.countryCode = json.country_code;
        this.phoneCode = json.phone_code;
        this.minRate = json.rates.min;
        this.maxRate = json.rates.max;
    }

    getCountryFlagUrl() {
        const baseUrl = "https://community-phone-bucket.nyc3.digitaloceanspaces.com/webflow/img/country-flags";
        const imageName = (() => {
            const countriesWithDefaultFlag = ["N/A", "ASC", "CK", "IO", "FO", "GF", "PYF", "GL", "GP", "KI", "KNA", "XK", "MF", "MH", "YT", "NR", "NC", "NU", "NF", "PS", "PM", "RE", "SS", "TV", "WF"];

            if (countriesWithDefaultFlag.includes(this.countryCode)) {
                return `WW.svg`;
            } else {
                return `${this.countryCode.toUpperCase()}.svg`;
            }
        })();
        return `${baseUrl}/${imageName}`;
    }
}

/**
 * @param {(rates: CountryCallRate[], error: any) => void} callback 
 * @returns {XMLHttpRequest}
 */
const getInternationalCallRatesForAllCountries = (callback) => {
    const api = CommunityPhoneAPI.currentEnvironmentWithVersion("2");
    return api.jsonRequest(
        CommunityPhoneAPI.endpoints.internationalCalls_getCallRatesRange,
        "GET",
        undefined,
        undefined,
        (response, error) => {
            if (error) {
                callback([], error);
            } else {
                const rates = response.countries.map(el => new CountryCallRate(el));
                callback(rates, undefined);
            }
        }
    );
};
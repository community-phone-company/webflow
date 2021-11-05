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

    /**
     * @param {"png" | "svg"} extension 
     * @returns {string}
     */
    getCountryFlagUrl(extension) {
        const baseUrl = "https://community-phone-bucket.nyc3.digitaloceanspaces.com/webflow/img/country-flags";
        const imageName = (() => {
            const countriesWithDefaultFlag = ["N/A", "AQ", "ASC", "CK", "IO", "FO", "GF", "PYF", "GL", "GP", "KI", "KNA", "XK", "MF", "MH", "YT", "NR", "NC", "NU", "NF", "PS", "PM", "RE", "SS", "TV", "WF"];

            if (countriesWithDefaultFlag.includes(this.countryCode)) {
                return `WW`;
            } else {
                return `${this.countryCode.toUpperCase()}`;
            }
        })();
        return `${baseUrl}/${imageName}.${extension}`;
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

/**
 * @param {string} phone 
 * @param {(phoneCallRate: number, countryCallRate: CountryCallRate, error: any) => void} callback 
 * @returns {XMLHttpRequest}
 */
const getInternationalCallRateForPhoneNumber = (phone, callback) => {
    const api = CommunityPhoneAPI.currentEnvironmentWithVersion("2");
    return api.jsonRequest(
        CommunityPhoneAPI.endpoints.internationalCalls_checkCallRates,
        "POST",
        undefined,
        {
            phone_number: phone
        },
        (response, error) => {
            if (error) {
                callback(
                    undefined,
                    undefined,
                    error
                );
            } else {
                const phoneCallRate = response.rate;
                const countryCallRate = new CountryCallRate(
                    response.country
                );
                callback(
                    phoneCallRate,
                    countryCallRate,
                    undefined
                );
            }
        }
    );
};
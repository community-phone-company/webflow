class PhoneNumberManager {

    /**
     * Finds cities using search query.
     * @param {string} searchQuery Search query.
     * @param {(cities: City[], error: any | undefined) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest} `XMLHttpRequest` instance.
     */
    static getCities = (searchQuery, callback) => {
        return $.ajax({
            method: "GET",
            url: `https://landline.phone.community/api/v1/search/cities`,
            dataType: 'json',
            data: {
                "cityFilter": searchQuery
            },
            success: function (response) {
                if (response instanceof Array) {
                    const cities = response.map(element => new City(
                        element.city,
                        element.state_code,
                        element.area_codes
                    ));
                    callback(cities, undefined);
                } else {
                    callback([], undefined);
                }
            },
            error: function (error) {
                console.log(`Error: `, error);
                callback([], error);
            }
        });
    }

    /**
     * Finds area codes using city and state code.
     * @param {string} city City.
     * @param {string} stateCode State code.
     * @param {boolean} tollFreeOnly Toll free only.
     * @param {(areaCodes: string[], error: any | undefined) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest} `XMLHttpRequest` instance.
     */
    static getAreaCodes = (city, stateCode, tollFreeOnly, callback) => {
        return $.ajax({
            method: "GET",
            url: `https://landline.phone.community/api/v1/search/city/areacodes`,
            dataType: 'json',
            data: {
                "city": city,
                "stateCode": stateCode,
                ...tollFreeOnly ? {"tollFree": true} : undefined
            },
            success: function (response) {
                if (response) {
                    const areaCodes = response.area_codes ?? [];
                    callback(areaCodes, undefined);
                } else {
                    callback([], undefined);
                }
            },
            error: function (error) {
                console.log(`Error: `, error);
                callback([], error);
            }
        });
    }

    /**
     * Finds available phone numbers.
     * @param {string} city City.
     * @param {string} stateCode State code.
     * @param {string} areaCode Area code.
     * @param {string} digits Digits.
     * @param {boolean} tollFreeOnly Toll free only.
     * @param {(numbers: PhoneNumber[], error: any | undefined) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest} `XMLHttpRequest` instance.
     */
    static getNumbers = (city, stateCode, areaCode, digits, tollFreeOnly, callback) => {
        const api = CommunityPhoneAPI.currentEnvironmentWithDefaultVersion();
        api.useStringifiedDataForJsonRequest = false;
        return api.jsonRequest(
            CommunityPhoneAPI.endpoints.search_numbers,
            "GET",
            undefined,
            {
                city: city,
                stateCode: stateCode,
                areaCode: areaCode,
                numberContains: digits,
                ...tollFreeOnly ? {tollFree: true} : undefined
            },
            (response, error) => {
                if (error) {
                    callback([], error);
                } else {
                    const numbers = response.numbers.map(element => new PhoneNumber(
                        element.area_code,
                        element.number,
                        element.city,
                        element.state_code
                    ));
                    callback(numbers, undefined);
                }
            }
        );
    }

    /**
     * Retrieves user's location based on IP address.
     * @param {(city: City | undefined, error: any) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest} `XMLHttpRequest` instance.
     */
    static getUserLocation = (callback) => {
        return $.ajax({
            method: "GET",
            url: "https://landline.phone.community/api/v1/search/user/current-location",
            dataType: 'json',
            data: {},
            success: function (response) {
                const cityName = response.city;
                const stateCode = response.state_code;
                const city = new City(
                    cityName,
                    stateCode,
                    []
                );
                callback(city, undefined);
            },
            error: function (error) {
                console.log(`Error: `, error);
                callback(undefined, error);
            }
        });
    }
}

class City {

    /**
     * @constructor
     * @param {string} name City.
     * @param {string} stateCode State code.
     * @param {string[]} areaCodes Array containing area codes.
     */
    constructor(name, stateCode, areaCodes) {
        this.name = name;
        this.stateCode = stateCode;
        this.areaCodes = areaCodes;
    }
}

class PhoneNumber {

    /**
     * @param {string} serialized 
     * @returns {PhoneNumber}
     */
    static deserialize = (serialized) => {
        const json = JSON.parse(
            atob(
                serialized
            )
        );
        const {areaCode, number, city, stateCode} = json;
        return new PhoneNumber(
            areaCode,
            number,
            city,
            stateCode
        );
    }

    /**
     * @constructor
     * @param {string} areaCode Area code.
     * @param {string} number Number.
     * @param {string | undefined} city City.
     * @param {string | undefined} stateCode State code.
     */
    constructor(
        areaCode,
        number,
        city,
        stateCode
    ) {
        this.areaCode = areaCode;
        this.number = number;
        this.city = city;
        this.stateCode = stateCode;
    }

    /**
     * @param {PhoneNumberFormatStyle | undefined} style
     * @returns {string}
     */
    formatted = (style) => {
        const styleOrDefault = style ?? PhoneNumberFormatStyle.regular;

        switch (styleOrDefault) {
            case PhoneNumberFormatStyle.regular:
                return `${this.areaCode}${this.number}`;
            case PhoneNumberFormatStyle.brackets:
                const formattedDigits = (() => {
                    if (this.number.length == 7) {
                        return `${this.number.toString().substring(0, 3)}-${this.number.toString().substring(3, 7)}`;
                    } else {
                        return this.number;
                    }
                })();
                return `(${this.areaCode}) ${formattedDigits}`;
            default:
                return this.formatted(undefined);
        }
    }

    /**
     * @returns {string}
     */
    serialize = () => {
        return btoa(
            JSON.stringify(
                this
            )
        );
    }
}

const PhoneNumberFormatStyle = Object.freeze({
    regular: "regular",
    brackets: "brackets"
});
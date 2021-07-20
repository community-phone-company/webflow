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
     * @param {(areaCodes: string[], error: any | undefined) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest} `XMLHttpRequest` instance.
     */
    static getAreaCodes = (city, stateCode, callback) => {
        return $.ajax({
            method: "GET",
            url: `https://landline.phone.community/api/v1/search/city/areacodes`,
            dataType: 'json',
            data: {
                "city": city,
                "stateCode": stateCode
            },
            success: function (response) {
                if (response) {
                    const areaCodes = response.areaCodes ?? [];
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
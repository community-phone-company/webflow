class PhoneNumberManager {

    /**
     * Finds cities using search query.
     * @param {string} searchQuery Search query.
     * @param {(cities: City[], error: any | undefined) => void} callback Function that is called when response comes from the server.
     * @returns {XMLHttpRequest} `XMLHttpRequest` instance.
     */
    static getCities = (searchQuery, callback) => {
        $.ajax({
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
}

class City {

    /**
     * @constructor
     * @param {string} city City.
     * @param {string} stateCode State code.
     * @param {string[]} areaCodes Array containing area codes.
     */
    constructor(city, stateCode, areaCodes) {
        this.city = city;
        this.stateCode = stateCode;
        this.areaCodes = areaCodes;
    }
}
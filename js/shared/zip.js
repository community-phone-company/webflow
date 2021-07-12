/**
 * Checks whether zip format is correct.
 * @param {string | number} zip String or number containing zip code to check.
 * @returns {boolean} `true` if format is correct.
 */
const isValidZipFormat = (zip) => {
    const isStringOrNumber = typeof zip === "string"
        || typeof zip === "number";

    const stringValue = String(zip);
    const isLengthAcceptable = stringValue.length == 5
        || stringValue.length == 6;
    
    const containsDigitsOnly = /^\d+$/.test(zip);
    
    return isStringOrNumber
        && isLengthAcceptable
        && containsDigitsOnly;
};

/**
 * Here we store all responses that come from the server.
 * 
 * Write to cache:
 * ```
 * zipResponseCache["02109"] = response;
 * ```
 * 
 * Read from cache:
 * ```
 * const response = zipResponseCache["02109"];
 * ```
 */
var zipResponseCache = {};

/**
 * Stores response in the cache.
 * @param {any | undefined} response Response object or `undefined`.
 * @param {string | number} zip String or number containing zip code.
 */
const putResponseToCache = (response, zip) => {
    console.log(`Writing to cache for zip code: ${zip}`);
    zipResponseCache[`${zip}`] = response;
};

/**
 * Reads response from cache.
 * @param {string | number} zip String or number containing zip code.
 * @returns {any | undefined} Response object or `undefined`.
 */
const getResponseFromCache = (zip) => {
    console.log(`Reading from cache for zip code: ${zip}`);
    return zipResponseCache[`${zip}`];
};

/**
 * Verifies zip code using backend API and sends a response to the callback.
 * @param {string | number} zip String or number containing zip code to check.
 * @param {((response: any | undefined, isValid: boolean) => void)} callback The function that is called when the result comes from the server.
 * @param {boolean} legacyAPI If `true`, request will be sent to the legacy API.
 * @returns {XMLHttpRequest | undefined} Request instance or `undefined`.
 */
const checkZip = (zip, callback, legacyAPI) => {
    /**
     * If zip code has wrong format, we return result via `callback` immediately
     * without sending request to the server.
     */
    if (!isValidZipFormat(zip)) {
        callback(undefined, false);
        return undefined;
    }

    const handleResponse = (response) => {
        const isValid = (() => {
            if (legacyAPI) {
                return response ? response.toString(response).includes("It will work!") : false;
            } else {
                return response ? response.message === "Has Coverage" : false;
            }
        })();
        callback(response, isValid);
    };

    const responseFromCache = getResponseFromCache(zip);

    /**
     * If response is already stored in the cache,
     * result will be returned via `callback` immediately.
     * Otherwise, we will send request to the server and handle the response.
     */
    if (responseFromCache) {
        console.log("Response loaded from cache");
        handleResponse(responseFromCache);
    } else {
        /**
         * Looks like a response for `zip` was not cached.
         * So we are sending a new request.
         */
        const url = legacyAPI
            ? `https://www.silvacode.com/clients/community/fn_ajax.php?callback=jQuery110007498869777800927_1623945075974&z=${zip}&_=1623945075978`
            : `https://landline.phone.community/api/v1/coverage/${zip}/check`;
        return $.ajax({
            method: "GET",
            url: url,
            crossDomain: true,
            dataType: 'jsonp',
            success: function (response) {
                putResponseToCache(response, zip);
                handleResponse(response);
            },
            error: function (error) {
                putResponseToCache(undefined, zip);
                handleResponse(undefined);
                console.log(error);
            }
        });
    }
};

/**
 * The last request that was sent to the server for checking zip code.
 */
var lastCheckZipCodeRequest = undefined;

/**
 * Automatically checks zip code typed in the text field.
 * @param {HTMLInputElement} textField Text field.
 * @param {((zip: string) => void)} beforeRequest The function that is called just before the request will be sent to the server. Use it to show preloader.
 * @param {((zip: string, response: any | undefined, isValid: boolean) => void)} afterRequest The function that is called when the result comes from the server.
 * @param {boolean} legacyAPI If `true`, requests will be sent to the legacy API.
 */
const checkZipOnChange = (textField, beforeRequest, afterRequest, legacyAPI) => {
    /**
     * Here we subscribe to text field's `oninput` event.
     */
    textField.oninput = () => {
        /**
         * If the previous request was not finished, stop it.
         */
        if (lastCheckZipCodeRequest) {
            lastCheckZipCodeRequest.abort();
        }

        /**
         * Obtain zip code from text field and tell the listener
         * that we are about to send a new request.
         */
        const zip = textField.value;
        beforeRequest(zip);

        /**
         * Send new request.
         */
        lastCheckZipCodeRequest = checkZip(
            zip,
            (response, isValid) => {
                afterRequest(zip, response, isValid);
            },
            legacyAPI
        );
    };
};
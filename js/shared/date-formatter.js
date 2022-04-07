/**
 * @param {number} day 
 * @param {number} month 
 * @param {boolean} shortened 
 * @returns 
 */
const getStringFromDayAndMonth = (
    day,
    month,
    shortened
) => {
    const formatter = new Intl.DateTimeFormat(
        "en",
        {
            month: shortened ? "short" : "long",
            day: "2-digit"
        }
    );
    return formatter.format(
        new Date(0, month - 1, day)
    );
}

/**
 * @param {number} timestamp 
 * @param {number} timezone 
 * @param {string} locale 
 * @returns {string}
 */
const getFormattedDateAndTime = (
    timestamp,
    timezone,
    locale
) => {
    var date = new Date(timestamp);
    date = new Date(timestamp + (date.getTimezoneOffset() + timezone * 60) * 60000);
    return date.toLocaleString(locale);
}

/**
 * @param {number} timestamp 
 * @returns {string}
 */
const getFormattedDateAndTimeForBoston = (timestamp) => {
    return getFormattedDateAndTime(
        timestamp,
        -4,
        "en-US"
    );
}
/**
 * @param {number} number 
 * @param {number} precision 
 * @returns {number}
 */
Math.roundUp = function(number, precision) { 
    return Math.ceil(number * Math.pow(10, precision)) / Math.pow(10, precision);
}

/**
 * @param {number} amount
 * @param {boolean} roundUp Defines whether to round up the amount.
 * @returns {string}
 */
Math.formatPrice = function(amount, roundUp) {
    var value = roundUp ? this.roundUp(amount, 2) : amount;
    const hasFractionalPart = (value % 1) > 0;
    return hasFractionalPart ? value.toFixed(2) : value;
}
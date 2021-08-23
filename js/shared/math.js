Math.roundUp = function(number, precision) { 
    return Math.ceil(number * Math.pow(10, precision)) / Math.pow(10, precision);
}
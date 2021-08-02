const subscribe = () => {
    const zipInput = $("#zip-input")[0];
    checkZipOnChange(
        zipInput,
        (zip) => {
            logger.print(`Sending request for ${zip}`);
        },
        (zip, response, isValid) => {
            logger.print(`zip: ${zip}, response: ${response}, isValid: ${isValid}`);
        }
    );
    logger.print("subscribed");
}

$(document).ready(() => {
    subscribe();
});
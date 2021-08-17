const subscribe = () => {
    const zipInput = $("#zip-input")[0];
    checkZipOnChange(
        zipInput,
        (zip) => {
            console.log(`Sending request for ${zip}`);
        },
        (zip, response, isValid) => {
            console.log(`zip: ${zip}, response: ${response}, isValid: ${isValid}`);
        }
    );
    console.log("subscribed");
}

$(document).ready(() => {
    subscribe();
});
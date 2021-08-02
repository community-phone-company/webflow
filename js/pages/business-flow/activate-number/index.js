$("#instruction-container").hide();

$(document).ready(() => {

    const selectedNumber = Store.local.read(
        Store.keys.businessFlow.selectedNumber
    );

    if (selectedNumber) {
        $("#title").html(`
            ${selectedNumber} is available!
        `);
    }

    $("#instruction-container").show();
});
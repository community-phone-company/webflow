$(document).ready(() => {
    exportCheckoutFlowDataToActiveCampaign(
        (response, error, success) => {
            console.log("Active Campaign");
        }
    );
});
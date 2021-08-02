$(document).ready(() => {
    
    /**
     * Send user's data to Active Campaign.
     */
    exportCheckoutFlowDataToActiveCampaign(
        (response, error, success) => {
            logger.print("Active Campaign");
        }
    );
});
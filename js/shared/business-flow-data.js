/**
 * Exports data stored in the local storage to Active Campaign.
 * @param {(response: any, error: any, success: boolean) => void} callback Function that is called when request to Active Campaign API is finished.
 * @returns {XMLHttpRequest} Request instance.
 */
const exportBusinessFlowDataToActiveCampaign = (callback) => {
    return ActiveCampaignIntegration.createOrUpdateContact(
        new ActiveCampaignContact(
            Store.local.read(Store.keys.businessFlow.selectedNumber),
            Store.local.read(Store.keys.businessFlow.firstName),
            Store.local.read(Store.keys.businessFlow.email),
            Store.local.read(Store.keys.businessFlow.cellphone),
            [
                new ActiveCampaignContactCustomField(
                    "Business name",
                    Store.local.read(Store.keys.businessFlow.businessName)
                )
            ]
        ),
        ActiveCampaignList.chooseNumber(),
        (response, error, success) => {
            if (callback) {
                callback();
            }
        }
    );
};
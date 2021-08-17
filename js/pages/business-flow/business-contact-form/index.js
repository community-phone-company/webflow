$(document).ready(() => {

    const submitButton = document.querySelectorAll("#wf-form-business-contact-form #submit-button")[0];
    $(submitButton).on("click", () => {
        const formData = Object.freeze({
            email: $("#email").val(),
            firstName: $("#First-Name").val(),
            lastName: $("#Last-name").val(),
            cellPhone: $("#cell_phone").val(),
            selectedPhoneNumber: Store.local.read(
                Store.keys.businessFlow.selectedNumber
            )
        });
        ActiveCampaignIntegration.createOrUpdateContact(
            new ActiveCampaignContact(
                formData.email,
                formData.firstName,
                formData.lastName,
                formData.cellPhone,
                [
                    new ActiveCampaignContactCustomField(
                        "Selected phone number",
                        formData.selectedPhoneNumber
                    )
                ]
            ),
            ActiveCampaignList.chooseNumber(),
            (response, error, success) => {
                console.log(`Active Campaign: ${success}`);
            }
        )
    });
});
$(document).ready(() => {
    
    /**
     * User types email here.
     */
    const emailTextField = document.querySelectorAll("input#Email")[0];

    if (emailTextField instanceof HTMLInputElement) {
        /**
         * Subscribe to email change event and transfer data to Hotjar.
         */
        emailTextField.oninput = () => {
            const email = emailTextField.value;
            const emailRegularExpression = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            const isEmail = emailRegularExpression.test(email);

            if (isEmail) {
                /*HotjarIntegration.send({
                    "Email": email
                });*/
            }
        };
    }

    /**
     * Here we handle submit button's click.
     */
    const submitButton = document.querySelectorAll("input.continue_account")[0];

    $(submitButton).on("click", (event) => {
        const firstName = $("#First-name").val();
        Store.local.write(CheckoutFlowStoreKey.firstName, firstName);

        const lastName = $("#Last-name").val();
        Store.local.write(CheckoutFlowStoreKey.lastName, lastName);

        const phone = $("#Contact-number").val();
        Store.local.write(CheckoutFlowStoreKey.phone, phone);

        const email = $("#Email").val();
        Store.local.write(CheckoutFlowStoreKey.email, email);

        HotjarIntegration.send({
            "Email": email
        });

        ActiveCampaignIntegration.createOrUpdateContact(
            new ActiveCampaignContact(
                email,
                firstName,
                lastName,
                phone,
                []
            )
        );
    });
});
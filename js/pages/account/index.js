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
                HotjarIntegration.send({
                    "Email": email
                });
            }
        };
    }
});
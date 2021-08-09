const useLegacyApiForZipRequest = false;

$(document).ready(() => {
    
    const zipForms = Object.freeze({
        top: new ZipForm(
            "#zip-code-form-hero",
            "#zip-check-top"
        ),
        bottom: new ZipForm(
            "#zip-code-form-bottom",
            "#zip-check-bottom"
        )
    });

    const allZipForms = [
        zipForms.top,
        //zipForms.bottom
    ];

    allZipForms.forEach(form => {
        form.setState(
            ZipFormState.withMode(
                ZipFormStateMode.initial
            )
        );

        checkZipOnChange(
            form.getZipInput(),
            (zip) => {
                logger.print(`sending zip code: ${zip}`);
                form.setState(
                    ZipFormState.withMode(
                        ZipFormStateMode.loading
                    )
                );
            },
            (zip, response, isValid) => {
                logger.print(`zip: ${zip}\nresponse: ${response}\nisValid: ${isValid}`)

                /**
                 * This is a temporary workaround.
                 * Response, that comes from the server, has wrong content.
                 * We currently replace it with predefined content on the client side.
                 * Remove the next `if(response) {...}` block when it's fixed on the server side.
                 */
                const message = (() => {
                    if (response) {
                        if (isValid) {
                            return `
                                We have coverage in your area!
                                Click to get started, or give us a call
                                to talk to one of our landline specialists.
                            `;
                        } else {
                            return `
                                We might have coverage at your address!
                                Call us at <a href="tel:8885824177">888-582-4177</a>
                                so we can check our coverage at your address.
                            `;
                        }
                    }

                    return undefined;
                })();

                const mode = isValid ? ZipFormStateMode.success : ZipFormStateMode.error;
                form.setState(
                    new ZipFormState(
                        mode,
                        message,
                        response
                    )
                );
            },
            useLegacyApiForZipRequest
        );

        $(form.getForm()).submit(event => {
            event.preventDefault();
        });

        $(form.getSubmitButton()).on("click", (event) => {
            event.preventDefault();
            const zipCode = form.getZipInput().value;
            Store.local.write(
                Store.keys.checkoutFlow.shippingAddress_zip,
                zipCode
            );
            window.location.href = "/checkout-landline/choose-a-plan";
        });
    });
});

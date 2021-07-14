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
        zipForms.bottom
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
                console.log(`sending zip code: ${zip}`);
                form.setState(
                    ZipFormState.withMode(
                        ZipFormStateMode.loading
                    )
                );
            },
            (zip, response, isValid) => {
                console.log(`zip: ${zip}\nresponse: ${response}\nisValid: ${isValid}`)

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
                                Great news! We do have coverage in your area.
                                Click below to choose your landline service plan,
                                or give us a call at <a href="tel:8556150667">(855) 615-0667</a>
                            `;
                        } else {
                            return `
                                We are launching here soon.
                                Please email us at <a href="mailto:help@communityphone.org">help@communityphone.org</a>
                                or call us at <a href="tel:8556150667">(855) 615-0667</a>
                                if you would like us to come to you sooner.
                            `;
                        }
                    }

                    return undefined;
                });

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
    });
});
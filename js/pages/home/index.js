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
            true
        );
    });

    /*
     * Top `check coverage` button.
     */
    /*const checkCoverageTopButton = document.getElementById("zipcode-check-1");
    
    if (checkCoverageTopButton instanceof HTMLInputElement) {
        $(checkCoverageTopButton).on("click", function (e) {
            e.preventDefault()
            let zip_code = $("#zipcode-2").val();
            $(this).val("Please wait...")
            
            if (zip_code.length) {
                checkZip(zip_code, (response, isValid) => {
                    if (isValid) {
                        $(".zip-check").html("Great news! We do have coverage in your area. Click below to choose your landline service plan, or give us a call at (855) 615-0667.")
                        $(".zipcode-container").css("display", "none")
                        $(".zip-check").append('<br><a href="/checkout-landline/choose-a-plan"><button class="primary-button" style="top: auto; right: auto;">Start your landline service</button></a>')
                    } else {
                        $(".zip-check").html(response)
                        $(".start-landline-btn").attr("data-wait", "Start my landline service")
                        $(".start-landline-btn").val("Start my landline service")
                    }
    
                    $(".coverage_response").css("font-size", "12px")
                    $(".coverage_response").css("line-height", "0")
                    $(".coverage_response").css("margin-top", "0")
                });
            } else {
                $(".start-landline-btn").val("Start my landline service")
                $(".zip-check").html('<p style="color: #ff0000">Please type your zip code<p>')
            }
        });
    }*/

    /*
     * Bottom `check coverage` button.
     */
    /*const checkCoverageBottomButton = document.getElementById("zipcode-check-2");
    
    if (checkCoverageBottomButton instanceof HTMLInputElement) {
        $("#zipcode-check-2").on("click", function (e) {
            e.preventDefault()
            let zip_code = $("#zipcode-bottom").val();
            $(this).val("Please wait...")
    
            if (zip_code.length) {
                checkZip(zip_code, (response, isValid) => {
                    if (isValid) {
                        $("#zip-check-bottom").html("Great news! We do have coverage in your area. Click below to choose your landline service plan, or give us a call at (855) 615-0667.")
                        $(".zipcode-container").css("display", "none")
                        $("#zip-check-bottom").append('<br><a href="/checkout-landline/choose-a-plan"><button class="primary-button" style="top: auto; right: auto;">Start your landline service</button></a>')
                    } else {
                        $("#zip-check-bottom").html(response)
                        $(".start-landline-btn").attr("data-wait", "Start my landline service")
                        $(".start-landline-btn").val("Start my landline service")
                    }
    
                    $(".coverage_response").css("font-size", "12px")
                    $(".coverage_response").css("line-height", "0")
                    $(".coverage_response").css("margin-top", "0")
                });
            } else {
                $(".start-landline-btn").val("Start my landline service")
                $("#zip-check-bottom").html('<p style="color: #ff0000">Please type your zip code<p>')
            }
        });
    }*/
});
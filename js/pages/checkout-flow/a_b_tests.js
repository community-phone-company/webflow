(() => {
    const getAdditionalSubmitButton = () => {
        return document.querySelectorAll("div.custom_dummy_cta a")[0];
    };
    const setupAdditionalSubmitButton = (button) => {
        const isCheckoutStep = window.location.href.endsWith("checkout-step");

        if (!isCheckoutStep) {
            $(button).removeClass("hide_cta");

            $(button).off().on("click", (event) => {
                event.preventDefault();
                $("#submit-button").click();
            });
        }
    };

    $(document).ready(() => {
        setTimeout(() => {
            const button = getAdditionalSubmitButton();

            if (button) {
                setupAdditionalSubmitButton(button);
                console.log("setupAdditionalSubmitButton");
            }
        }, 2000);
    });
})();
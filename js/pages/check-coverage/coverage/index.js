const Page = {
    ui: {
        startYourServiceButton: document.getElementById("start-your-service-button")
    }
};

const getCheckoutUrl = () => {
    return getCheckoutUrlWithCheckCoverageData(
        CONFIGURATION.checkout.usePreCheckout
    );
};

const openCheckout = () => {
    window.location.href = getCheckoutUrl();
};

const setupUI = () => {
    $(Page.ui.startYourServiceButton).attr(
        "href",
        getCheckoutUrl()
    );

    $("#start-your-service-button").off("click").on("click", (event) => {
        event.preventDefault();
        openCheckout();
    });
};

setupUI();
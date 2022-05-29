const useCheckout_v3 = true;
const usePreCheckout = false;

const Page = {
    ui: {
        startYourServiceButton: document.getElementById("start-your-service-button")
    }
};

const getCheckoutUrl = () => {
    if (useCheckout_v3) {
        return getCheckoutUrlWithCheckCoverageData(
            true
        );
    } else {
        return IS_MOBILE
            ? RouterPath.checkout_v2_choosePlan
            : RouterPath.checkout_v2_choosePlanAndNumber;
    }
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
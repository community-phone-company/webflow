const useCheckout_v3 = true;

const openCheckout = () => {
    if (useCheckout_v3) {
        window.location.href = getCheckoutUrlWithCheckCoverageData();
    } else {
        const path = IS_MOBILE ? RouterPath.checkout_v2_choosePlan : RouterPath.checkout_v2_choosePlanAndNumber;
        router.open(
            path,
            router.getParameters(),
            false
        );
    }
};

$("#start-your-service-button").off("click").on("click", (event) => {
    event.preventDefault();
    openCheckout();
});
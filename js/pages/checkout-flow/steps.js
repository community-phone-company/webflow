const is_v2 = window.location.href.includes("checkout-v2");

const CheckoutFlowStep = Object.freeze({
    choosePlan: "choose-plan",
    account: "account",
    checkout: "checkout"
});

const getCheckoutFlowStepsOrder = () => {
    return [
        CheckoutFlowStep.choosePlan,
        CheckoutFlowStep.account,
        CheckoutFlowStep.checkout
    ];
};

/**
 * @param {string} step 
 * @returns {boolean}
 */
const storeHasDataFromCheckoutFlowStep = (step) => {
    switch (step) {
        case CheckoutFlowStep.choosePlan: {
            return Store.local.read(Store.keys.checkoutFlow.getNewNumber) != undefined
                && Store.local.read(Store.keys.checkoutFlow.period) != undefined
                && Store.local.read(Store.keys.checkoutFlow.addHandsetPhone) != undefined
                && Store.local.read(Store.keys.checkoutFlow.addInsurance) != undefined;
        }
        case CheckoutFlowStep.account: {
            return Store.local.read(Store.keys.checkoutFlow.firstName) != undefined
                && Store.local.read(Store.keys.checkoutFlow.lastName) != undefined
                && Store.local.read(Store.keys.checkoutFlow.phone) != undefined
                && Store.local.read(Store.keys.checkoutFlow.email) != undefined;
        }
        case CheckoutFlowStep.checkout: {
            return Store.local.read(Store.keys.checkoutFlow.shippingAddress_firstName) != undefined
                && Store.local.read(Store.keys.checkoutFlow.shippingAddress_lastName) != undefined
                && Store.local.read(Store.keys.checkoutFlow.shippingAddress_addressLine1) != undefined
                && Store.local.read(Store.keys.checkoutFlow.shippingAddress_addressLine2) != undefined
                && Store.local.read(Store.keys.checkoutFlow.shippingAddress_city) != undefined
                && Store.local.read(Store.keys.checkoutFlow.shippingAddress_zip) != undefined
                && Store.local.read(Store.keys.checkoutFlow.shippingAddress_state) != undefined
                && Store.local.read(Store.keys.checkoutFlow.billingAddress_firstName) != undefined
                && Store.local.read(Store.keys.checkoutFlow.billingAddress_lastName) != undefined
                && Store.local.read(Store.keys.checkoutFlow.billingAddress_addressLine1) != undefined
                && Store.local.read(Store.keys.checkoutFlow.billingAddress_addressLine2) != undefined
                && Store.local.read(Store.keys.checkoutFlow.billingAddress_city) != undefined
                && Store.local.read(Store.keys.checkoutFlow.billingAddress_zip) != undefined
                && Store.local.read(Store.keys.checkoutFlow.billingAddress_state) != undefined;
        }
    }
};

/**
 * @param {string} step 
 */
const getUrlForCheckoutFlowStep = (step) => {
    switch (step) {
        case CheckoutFlowStep.choosePlan: {
            return "checkout-landline/choose-a-plan";
        }
        case CheckoutFlowStep.account: {
            return "checkout-landline/account";
        }
        case CheckoutFlowStep.checkout: {
            return "checkout-landline/checkout-step";
        }
    }
};

const redirectToPreviousCheckoutFlowStepIfNeeded = () => {
    const steps = getCheckoutFlowStepsOrder();

    for (const step of steps) {
        const stepUrl = getUrlForCheckoutFlowStep(step);

        if (window.location.href.endsWith(stepUrl)) {
            return;
        }

        if (!storeHasDataFromCheckoutFlowStep(step)) {
            router.open(
                stepUrl,
                router.getParameters(),
                router.isTestEnvironment()
            );
            return;
        }
    }
};

$("#side-menu-link-choose-plan").on("click", (event) => {
    event.preventDefault();
    router.open(
        is_v2 ? RouterPath.checkout_v2_choosePlanAndNumber : RouterPath.checkoutLandline_choosePlan,
        router.getParameters(),
        router.isTestEnvironment()
    );
});

$("#side-menu-link-account").on("click", (event) => {
    event.preventDefault();
    router.open(
        is_v2 ? RouterPath.checkout_v2_account : RouterPath.checkoutLandline_account,
        router.getParameters(),
        router.isTestEnvironment()
    );
});

$("#side-menu-link-checkout").on("click", (event) => {
    event.preventDefault();
    router.open(
        is_v2 ? RouterPath.checkout_v2_checkoutStep : RouterPath.checkoutLandline_checkoutStep,
        router.getParameters(),
        router.isTestEnvironment()
    );
});
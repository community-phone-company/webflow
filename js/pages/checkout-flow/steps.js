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
            return "/checkout-landline/choose-a-plan";
        }
        case CheckoutFlowStep.account: {
            return "checkout-landline/account";
        }
        case CheckoutFlowStep.checkout: {
            return "/checkout-landline/checkout-step";
        }
    }
};

const redirectToPreviousCheckoutFlowStepIfNeeded = () => {
    const steps = getCheckoutFlowStepsOrder();

    for (const step of steps) {
        if (!storeHasDataFromCheckoutFlowStep(step)) {
            window.location.href = getUrlForCheckoutFlowStep(step);
            return;
        }
    }
};
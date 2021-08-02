const BusinessFlowStoreKey = Object.freeze({
    selectedNumber: "choose-business-number-selected-number",
    firstName: "choose-business-number-first-name",
    email: "choose-business-number-email",
    cellphone: "choose-business-number-cellphone",
    businessName: "choose-business-number-business-name"
});

const CheckoutFlowStoreKey = Object.freeze({
    getNewNumber: "checkout-flow-get-new-number",
    period: "checkout-flow-period",
    addHandsetPhone: "checkout-flow-add-handset-phone",
    addInsurance: "checkout-flow-add-insurance",
    firstName: "checkout-flow-first-name",
    lastName: "checkout-flow-last-name",
    phone: "checkout-flow-phone",
    email: "checkout-flow-email",
    shippingAddress_firstName: "checkout-flow-shipping-address-first-name",
    shippingAddress_lastName: "checkout-flow-shipping-address-last-name",
    shippingAddress_addressLine1: "checkout-flow-shipping-address-address-line-1",
    shippingAddress_addressLine2: "checkout-flow-shipping-address-address-line-2",
    shippingAddress_city: "checkout-flow-shipping-address-city",
    shippingAddress_zip: "checkout-flow-shipping-address-zip",
    shippingAddress_state: "checkout-flow-shipping-address-state",
    billingAddress_firstName: "checkout-flow-billing-address-first-name",
    billingAddress_lastName: "checkout-flow-billing-address-last-name",
    billingAddress_addressLine1: "checkout-flow-billing-address-address-line-1",
    billingAddress_addressLine2: "checkout-flow-billing-address-address-line-2",
    billingAddress_city: "checkout-flow-billing-address-city",
    billingAddress_zip: "checkout-flow-billing-address-zip",
    billingAddress_state: "checkout-flow-billing-address-state",
    productPurchased: "product-purchased"
});

const OnboardingFlowStoreKey = Object.freeze({
    email: "onboarding-flow-email",
    callerId: "onboarding-flow-caller-id",
    didSetupCallerId: "onboarding-flow-did-setup-caller-id",
    didSetupVoicemail: "onboarding-flow-did-setup-voicemail",
    didShowConfetti: "onboarding-flow-did-show-confetti",
    furthestStep: "onboarding-flow-furthest-step"
});

Store.keys = Object.freeze({
    businessFlow: BusinessFlowStoreKey,
    checkoutFlow: CheckoutFlowStoreKey,
    onboardingFlow: OnboardingFlowStoreKey
});
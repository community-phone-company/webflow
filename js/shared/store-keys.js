const BusinessFlowStoreKey = Object.freeze({
    selectedNumber: "choose-business-number-selected-number",
    firstName: "choose-business-number-first-name",
    email: "choose-business-number-email",
    cellphone: "choose-business-number-cellphone",
    businessName: "choose-business-number-business-name"
});

const CheckoutFlowStoreKey = Object.freeze({
    sessionId: "checkout-flow-session-id",
    getNewNumber: "checkout-flow-get-new-number",
    period: "checkout-flow-period",
    addHandsetPhone: "checkout-flow-add-handset-phone",
    addInsurance: "checkout-flow-add-insurance",
    firstName: "checkout-flow-first-name",
    lastName: "checkout-flow-last-name",
    phone: "checkout-flow-phone",
    email: "checkout-flow-email",
    howDidYouHearAboutUs: "checkout-flow-how-did-you-hear-about-us",
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
    productPurchased: "checkout-flow-product-purchased",
    selectedProductIdentifiers: "checkout-flow-selected-product-identifiers",
    selectedPhoneNumber: "checkout-flow-selected-phone-number",
    orderedBySalesperson: "checkout-flow-ordered-by-salesperon",
    isBusinessCustomer: "checkout-flow-is-business-customer"
});

const NumberSearchStoreKey = Object.freeze({
    selectedAreaCode: "number-search-selected-area-code",
    selectedDigits: "number-search-selected-digits"
});

const PortPhoneNumberStoreKey = Object.freeze({
    carrierName: "port-phone-number-carrier-name",
    accountNumber: "port-phone-number-account-number",
    pin: "port-phone-number-pin",
    accountName: "port-phone-number-account-name",
    numberToPort: "port-phone-number-phone-number",
    firstName: "port-phone-number-first-name",
    lastName: "port-phone-number-last-name",
    addressLineOne: "port-phone-number-address-line-one",
    addressLineTwo: "port-phone-number-address-line-two",
    city: "port-phone-number-city",
    zip: "port-phone-number-zip",
    state: "port-phone-number-state"
});

const OnboardingFlowStoreKey = Object.freeze({
    email: "onboarding-flow-email",
    firstName: "onboarding-flow-first-name",
    lastName: "onboarding-flow-last-name",
    addressLineOne: "onboarding-flow-address-line-one",
    addressLineTwo: "onboarding-flow-address-line-two",
    city: "onboarding-flow-city",
    zip: "onboarding-flow-zip",
    stateCode: "onboarding-flow-state-code",
    callerId: "onboarding-flow-caller-id",
    didSetupCallerId: "onboarding-flow-did-setup-caller-id",
    didSetupVoicemail: "onboarding-flow-did-setup-voicemail",
    didShowConfetti: "onboarding-flow-did-show-confetti",
    furthestStep: "onboarding-flow-furthest-step",
    firstVisitTimestamp: "onboarding-flow-first-visit-timestamp",
    numberOfVisits: "onboarding-flow-number-of-visits",
    numberOfVisitsToStep_1: "onboarding-flow-number-of-visits-to-step-1",
    numberOfVisitsToStep_2: "onboarding-flow-number-of-visits-to-step-2",
    numberOfVisitsToStep_3: "onboarding-flow-number-of-visits-to-step-3",
    numberOfVisitsToStep_4: "onboarding-flow-number-of-visits-to-step-4",
    numberOfVisitsToStep_5: "onboarding-flow-number-of-visits-to-step-5",
    numberOfVisitsToStep_6: "onboarding-flow-number-of-visits-to-step-6",
    numberOfVisitsToStep_7: "onboarding-flow-number-of-visits-to-step-7",
    numberOfVisitsToStep_8: "onboarding-flow-number-of-visits-to-step-8",
    troubleshootingLinkClickCount: "onboarding-flow-troubleshooting-link-click-count"
});

const UserPortalStoreKey = Object.freeze({
    authorizationToken: "user-portal-authorization-token"
});

const GeneralSettingsStoreKey = Object.freeze({
    userId: "general-settings-user-id",
    lastUrl: "general-settings-last-url"
});

Store.keys = Object.freeze({
    businessFlow: BusinessFlowStoreKey,
    checkoutFlow: CheckoutFlowStoreKey,
    numberSearch: NumberSearchStoreKey,
    onboardingFlow: OnboardingFlowStoreKey,
    userPortal: UserPortalStoreKey,
    portPhoneNumber: PortPhoneNumberStoreKey,
    generalSettings: GeneralSettingsStoreKey
});
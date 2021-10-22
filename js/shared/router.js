class Router {

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * Absolute URL.
     * @param {string} path Relative path.
     * @param {any | undefined} parameters Plain object containing URL parameters.
     * @param {boolean | undefined} testEnvironment Defines whether the page is from test environment.
     * @returns {string} Absolute URL.
     */
    getAbsoluteUrl = (path, parameters, testEnvironment) => {
        const parametersSegment = (() => {
            if (parameters) {
                const keys = Object.keys(parameters);

                if (keys.length) {
                    return keys.reduce(
                        (previous, current, index) => `${previous}${index > 0 ? "&" : ""}${current}=${parameters[current]}`,
                        "?"
                    );
                }
            }

            return "";
        })();
        return testEnvironment
            ? `${window.location.protocol}//${window.location.host}/${RouterPathTestEnvironmentPrefix}/${path}${parametersSegment}`
            : `${window.location.protocol}//${window.location.host}/${path}${parametersSegment}`;
    }

    /**
     * Checks whether the current page is in the test environment.
     * @returns {boolean} `true` if the current page is in the test environment.
     */
    isTestEnvironment = () => {
        const segments = window.location.pathname.replace(/^\/|\/$/g, '').split("/");
        return segments[0] === RouterPathTestEnvironmentPrefix;
    }

    /**
     * Redirects to the specified page.
     * @param {string} path Path for the page. It's recommended to use {@link RouterPath} values here.
     * @param {any | undefined} parameters Plain object containing URL parameters.
     * @param {boolean | undefined} testEnvironment Defines whether the page is from test environment.
     */
    open = (path, parameters, testEnvironment) => {
        const absoluteUrl = this.getAbsoluteUrl(
            path,
            parameters,
            testEnvironment
        );
        window.location.href = absoluteUrl;
    }

    /**
     * @returns {any} Plain object containing URL parameters.
     */
    getParameters = () => {
        return Object.fromEntries(
            new URLSearchParams(
                window.location.search
            ).entries()
        );
    }

    /**
     * Reads URL parameter's value.
     * @param {string} key URL parameter's key. It's recommended to use {@link RouterPathParameter} values here.
     * @returns {any | undefined} Parameter's value or undefined.
     */
    getParameterValue = (key) => {
        const allParameters = this.getParameters();
        return allParameters[key];
    }
}

const RouterPathTestEnvironmentPrefix = "test-environment";

const RouterPath = Object.freeze({
    /**
     * General
     */
    home: "",
    landlineService: "landline",

    /**
     * Onboarding
     */
    onboarding_general_account: "onboarding/general/account",
    onboarding_general_numberType: "onboarding/general/number-type",
    onboarding_onboarding_step_1: "onboarding/onboarding/step-1",
    onboarding_onboarding_step_2: "onboarding/onboarding/step-2",
    onboarding_onboarding_step_3: "onboarding/onboarding/step-3",
    onboarding_onboarding_step_4: "onboarding/onboarding/step-4",
    onboarding_onboarding_step_5: "onboarding/onboarding/step-5",
    onboarding_onboarding_step_6: "onboarding/onboarding/step-6",
    onboarding_onboarding_step_7: "onboarding/onboarding/step-7",
    onboarding_onboarding_step_8: "onboarding/onboarding/step-8",
    onboarding_onboarding_setupService: "onboarding/onboarding/set-up-service",
    onboarding_onboarding_testCallDidNotWork: "onboarding/onboarding/not-successful-state",
    onboarding_onboarding_voicemail: "onboarding/onboarding/voicemail",
    onboarding_onboarding_callerId: "onboarding/onboarding/caller-id",
    onboarding_onboarding_thankYou: "onboarding/onboarding/thank-you-for-onboarding",
    onboarding_porting_previousCarrier: "onboarding/porting/previous-carrier",
    onboarding_porting_numberTransfer: "onboarding/porting/number-transfer",
    onboarding_porting_thankYou: "onboarding/porting/thank-you-for-porting",

    /**
     * Check coverage
     */
    checkCoverage_serviceAddress: "check-coverage/service-address",
    checkCoverage_coverage: "check-coverage/we-have-coverage-at-your-address",
    checkCoverage_email: "check-coverage/get-more-info-about-our-landline-service-via-email",
    
    /**
     * Checkout v1
     */
    checkoutLandline_choosePlan: "checkout-landline/choose-a-plan",
    checkoutLandline_account: "checkout-landline/account",
    checkoutLandline_checkoutStep: "checkout-landline/checkout-step",
    checkoutLandline_thankYou: "checkout-landline/thank-you",
    
    /**
     * Checkout v2
     */
    checkout_v2_choosePlan: "checkout-v2/choose-a-plan",
    checkout_v2_choosePlanAndNumber: "checkout-v2/choose-plan-and-number",
    checkout_v2_account: "checkout-v2/account",
    checkout_v2_checkoutStep: "checkout-v2/checkout-step",
    checkout_v2_thankYou: "checkout-v2/thank-you",

    /**
     * Checkout v3
     */
    checkout_v3_checkout: "checkout-v3/checkout-flow",
    checkout_v3_choosePhoneNumber: "checkout-v3/services/choose-phone-number",
    checkout_v3_portPhoneNumber: "checkout-v3/services/choose-your-previous-carrier"
});

const RouterPathParameter = Object.freeze({
    portingActivated: "p",
    newNumberActivated: "n",
    checkoutVersion_1: "v1",
    sales: "sales",
    checkoutSessionId: "session_id"
});

const router = new Router();
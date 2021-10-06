const orderBySalesperson = router.getParameterValue(RouterPathParameter.sales) != undefined;
const isTestingPortPhoneNumberFunctionality = router.getParameterValue("test-port-number") != undefined;

const externalServices = {
    msp: {
        enabled: router.getParameterValue("msp") != undefined
    },
    wirefly: {
        enabled: router.getParameterValue("wirefly") != undefined
    }
};

const elements = {
    externalServices: {
        msp: {
            logo: document.querySelectorAll("#logo-msp")[0]
        },
        wirefly: {
            logo: document.querySelectorAll("#logo-wirefly")[0]
        }
    },
    checkCoverageButtons: [
        document.querySelectorAll("#check-coverage-button-1")[0],
        document.querySelectorAll("#check-coverage-button-2")[0],
        document.querySelectorAll("#check-coverage-button-3")[0],
        document.querySelectorAll("#check-coverage-button-4")[0],
        document.querySelectorAll("#check-coverage-cta")[0]
    ]
};

const openCheckout = () => {
    const path = (() => {
        if (isTestingPortPhoneNumberFunctionality) {
            return "checkout-v2/choose-plan-and-number-2";
        } else {
            return IS_MOBILE ? RouterPath.checkout_v2_choosePlan : RouterPath.checkout_v2_choosePlanAndNumber;
        }
    })();
    router.open(
        path,
        router.getParameters(),
        false
    );
};

/**
 * @returns {boolean}
 */
const isCheckCoverageDataFilled = () => {
    const data = [
        Store.keys.checkoutFlow.shippingAddress_addressLine1,
        Store.keys.checkoutFlow.shippingAddress_addressLine2,
        Store.keys.checkoutFlow.shippingAddress_city,
        Store.keys.checkoutFlow.shippingAddress_state,
        Store.keys.checkoutFlow.shippingAddress_zip,
        Store.keys.checkoutFlow.isBusinessCustomer
    ].map(key => Store.local.read(key));
    return !data.includes(
        undefined
    );
};

const setupUI = () => {
    if (externalServices.msp.enabled) {
        $(elements.externalServices.msp.logo).show();
    }

    if (externalServices.wirefly.enabled) {
        $(elements.externalServices.wirefly.logo).show();
    }

    if (isCheckCoverageDataFilled()) {
        const title = "Start your service";

        elements.checkCoverageButtons.forEach(button => {
            if (button instanceof HTMLInputElement) {
                $(button).val(title);
            } else if (button instanceof HTMLAnchorElement) {
                $(button).find("strong").html(title);
            }
        });

        $(elements.checkCoverageButtons).on("click", (event) => {
            event.preventDefault();
            openCheckout();
        });
    } else {
        $(elements.checkCoverageButtons).on("click", (event) => {
            event.preventDefault();
            router.open(
                RouterPath.checkCoverage_serviceAddress,
                router.getParameters(),
                router.isTestEnvironment()
            );
        });
    }
};

$(document).ready(() => {
    setupUI();
});
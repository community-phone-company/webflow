const orderBySalesperson = router.getParameterValue(RouterPathParameter.sales) != undefined;

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
    ].filter(el => el != undefined)
};

const data = {
    premiumFeaturesForm: {
        email: "",
        phone: ""
    }
};

const openCheckout = () => {
    const path = IS_MOBILE ? RouterPath.checkout_v2_choosePlan : RouterPath.checkout_v2_choosePlanAndNumber;
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

/**
 * @param {HTMLFormElement} form 
 */
const setupPremiumFeaturesForm = (form) => {
    const isFormValid = () => {
        return new EmailValidator().check(data.premiumFeaturesForm.email)
            && data.premiumFeaturesForm.phone.length > 0;
    };

    const onFormChanged = () => {
        UserInterface.setElementEnabled(
            submitButton,
            isFormValid()
        );
    };

    const emailTextField = $(form).find("#premium-features-form_email-text-field")[0];
    new InputValueObserver(emailTextField).startObserving(newValue => {
        data.premiumFeaturesForm.email = newValue;
        onFormChanged();
    });

    const phoneTextField = $(form).find("#premium-features-form_phone-number-text-field")[0];
    new InputValueObserver(phoneTextField).startObserving(newValue => {
        data.premiumFeaturesForm.phone = newValue;
        onFormChanged();
    });

    const submitButton = $(form).find("#premium-features-form_submit-button")[0];
    $(submitButton).on("click", (event) => {
        if (isFormValid()) {
            ZapierIntegration.sendToWebhook(
                ActiveCampaignList.premiumFeaturesDemo().webhookUrl,
                data.premiumFeaturesForm
            );
        }
    });
    
    onFormChanged();
};

/**
 * @returns {HTMLFormElement[]}
 */
const getAllPremiumFeaturesForms = () => {
    const formSelectors = [
        "form#premium-features-form",
        "form#premium-features-form-tablet",
        "form#premium-features-form-mobile"
    ];
    return formSelectors
        .map(selector => {
            return Array.from(
                $(selector)
            ).pop();
        })
        .filter(form => {
            return form != undefined;
        });
};

/**
 * @param {HTMLFormElement} form
 */
const setupNumberSearchForm = (form) => {
    UserInterface.makeFormUnsubmittable(
        form
    );

    const areaCodeInput = $(form).find("#area-code-input")[0];
    const phoneNumberInput = $(form).find("#phone-number-input")[0];
    
    const searchButton = $(form).find("#search-button")[0];
    $(searchButton).on("click", () => {
        const areaCode = areaCodeInput.value
            .replaceAll("(", "")
            .replaceAll(")", "");
        const phoneNumber = phoneNumberInput.value
            .replaceAll("-", "");

        const isFormValid = areaCode.length == 3
            && phoneNumber.length == 7;
        
        if (isFormValid) {
            const selectedPhoneNumber = new PhoneNumber(
                areaCode,
                phoneNumber,
                undefined,
                undefined
            );
            Store.local.write(
                Store.keys.checkoutFlow.selectedPhoneNumber,
                selectedPhoneNumber.serialize()
            );
            router.open(
                RouterPath.checkout_v2_choosePlanAndNumber,
                router.getParameters(),
                router.isTestEnvironment()
            );
        }
    });
};

/**
 * @returns {HTMLFormElement[]}
 */
const getNumberSearchForms = () => {
    return [
        $("#number-search-form")[0]
    ];
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

    getAllPremiumFeaturesForms().forEach(form => {
        setupPremiumFeaturesForm(form);
    });

    getNumberSearchForms().forEach(form => {
        setupNumberSearchForm(form);
    });
};

$(document).ready(() => {
    setupUI();
});
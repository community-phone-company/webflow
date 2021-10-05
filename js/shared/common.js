/**
 * Here we write any code that should run on every page of the website.
 */

/**
 * Block printing in console log on production domain.
 */
if (IS_PRODUCTION) {
    //logger.setLoggingEnabled(false);
}

/**
 * Write current URL to the storage and check previous URL.
 */
(() => {
    const previousPage = Store.local.read(
        Store.keys.generalSettings.lastUrl
    );
    Store.local.write(
        Store.keys.generalSettings.lastUrl,
        window.location.href
    );

    if (previousPage) {
        /**
         * If the previous page was the last page of checkout flow,
         * redirect to landline page.
         */
        const finishedCheckoutFlow = previousPage.endsWith(
            RouterPath.checkoutLandline_thankYou
        );

        if (finishedCheckoutFlow) {
            router.open(
                RouterPath.landlineService,
                router.getParameters(),
                router.isTestEnvironment()
            );
        }
    }
})();

/**
 * Send user ID and other information to Hotjar.
 * Works on production domain for pages that are not included in the `test-environment` folder.
 */
(() => {
    if (!IS_PRODUCTION || router.isTestEnvironment()) {
        return;
    }

    const emails = {
        businessFlow: Store.local.read(
            Store.keys.businessFlow.email
        ),
        onboardingFlow: Store.local.read(
            Store.keys.onboardingFlow.email
        ),
        checkoutFlow: Store.local.read(
            Store.keys.checkoutFlow.email
        )
    };
    const firstNonNullEmail = emails.businessFlow
        ?? emails.onboardingFlow
        ?? emails.checkoutFlow;
    
    const address = {
        shipping: (() => {
            const line1 = Store.local.read(Store.keys.checkoutFlow.shippingAddress_addressLine1) ?? "";
            const line2 = Store.local.read(Store.keys.checkoutFlow.shippingAddress_addressLine2) ?? "";
            const city = Store.local.read(Store.keys.checkoutFlow.shippingAddress_city) ?? "";
            const zip = Store.local.read(Store.keys.checkoutFlow.shippingAddress_zip) ?? "";
            const state = Store.local.read(Store.keys.checkoutFlow.shippingAddress_state) ?? "";
            return `${line1}${line2.length ? ` ${line2}` : ""}, ${city}, ${state} ${zip}`;
        })(),
        billing: (() => {
            const line1 = Store.local.read(Store.keys.checkoutFlow.billingAddress_addressLine1) ?? "";
            const line2 = Store.local.read(Store.keys.checkoutFlow.billingAddress_addressLine2) ?? "";
            const city = Store.local.read(Store.keys.checkoutFlow.billingAddress_city) ?? "";
            const zip = Store.local.read(Store.keys.checkoutFlow.billingAddress_zip) ?? "";
            const state = Store.local.read(Store.keys.checkoutFlow.billingAddress_state) ?? "";
            return `${line1}${line2.length ? ` ${line2}` : ""}, ${city}, ${state} ${zip}`;
        })()
    };
    
    const data = {
        "Last Visit": new Date(Date.now()).toISOString(),
        "Email": firstNonNullEmail,
        "Onboarding email": emails.onboardingFlow,
        "Checkout email": emails.checkoutFlow,
        "Account name": `${Store.local.read(Store.keys.checkoutFlow.firstName) ?? ""} ${Store.local.read(Store.keys.checkoutFlow.lastName) ?? ""}`,
        "Shipping name": (() => {
            const firstName = Store.local.read(Store.keys.checkoutFlow.shippingAddress_firstName) ?? "";
            const lastName = Store.local.read(Store.keys.checkoutFlow.shippingAddress_lastName) ?? "";

            if (firstName.length > 0 && lastName.length > 0) {
                return `${firstName} ${lastName}`;
            } else {
                return undefined;
            }
        })(),
        "Shipping address": address.shipping,
        "Billing name": (() => {
            const firstName = Store.local.read(Store.keys.checkoutFlow.billingAddress_firstName) ?? "";
            const lastName = Store.local.read(Store.keys.checkoutFlow.billingAddress_lastName) ?? "";

            if (firstName.length > 0 && lastName.length > 0) {
                return `${firstName} ${lastName}`;
            } else {
                return undefined;
            }
        })(),
        "Billing address": address.billing,
        "Contact number": Store.local.read(Store.keys.checkoutFlow.phone)
    };
    HotjarIntegration.send(data);
    console.log(`Hotjar:`, data);
})();

/**
 * Chargebee user portal.
 */
(() => {
    const removeUserPortalLink = () => {
        const userPortalLink = UserPortalManager.getDefault().getUserPortalLink();
    
        if (userPortalLink) {
            $(userPortalLink).remove();
        }
    };
    
    if (UserPortalManager.isSupported()) {
        const userPortalManager = UserPortalManager.getDefault();
        userPortalManager.setupUI();
        userPortalManager.setAuthorizationToken(
            Store.local.read(
                Store.keys.userPortal.authorizationToken
            )
        );
    }
})();
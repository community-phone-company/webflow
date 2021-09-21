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
    const emailToSend = emails.businessFlow
        ?? emails.onboardingFlow
        ?? emails.checkoutFlow;
    
    const data = {
        "Last Visit": new Date(Date.now()).toISOString(),
        "Email": emailToSend,
        "Onboarding email": emails.onboardingFlow,
        "Checkout email": emails.checkoutFlow
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

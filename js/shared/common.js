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
    const lastUrlStoreKey = "last-url";
    const previousPage = Store.local.read(
        lastUrlStoreKey
    );
    Store.local.write(
        lastUrlStoreKey,
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

    HotjarIntegration.send({
        "Last Visit": new Date(Date.now()).toISOString()
    });
    
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
    
    if (emailToSend) {
        HotjarIntegration.send({
            "Email": emailToSend
        });
        console.log(`Hotjar: ${emailToSend}`);
    }
})();

/**
 * Remove Chargebee link on production.
 */
(() => {
    const removeUserPortalLink = () => {
        const userPortalLink = UserPortalManager.getDefault().getUserPortalLink();
    
        if (userPortalLink) {
            $(userPortalLink).remove();
        }
    };
    
    if (IS_PRODUCTION) {
        removeUserPortalLink();
    } else {
        if (UserPortalManager.isSupported()) {
            UserPortalManager.getDefault().setup();
        }
    }
})();

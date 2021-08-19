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
 * Send user ID and other information to Hotjar.
 */
(() => {
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
if (IS_PRODUCTION) {
    $("#user-portal-v1").remove();
}
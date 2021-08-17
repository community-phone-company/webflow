/**
 * Here we write any code that should be run on every page of the website.
 */

/**
 * Block printing in console log on production domain.
 */
if (IS_PRODUCTION) {
    //console.log = () => {};
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
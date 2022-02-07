$("#troubleshooting-link").on("click", (event) => {
    const email = Store.local.read(
        Store.keys.onboardingFlow.email
    ) ?? "";

    if (!email.length) {
        return;
    }

    var clickCount = Store.local.read(
        Store.keys.onboardingFlow.troubleshootingLinkClickCount
    ) ?? 0;
    
    clickCount++;
    
    Store.local.write(
        Store.keys.onboardingFlow.troubleshootingLinkClickCount,
        clickCount
    );

    GoogleDocIntegration.addLineToOnboarding({
        email: email,
        troubleshootingLinkClickCount: clickCount
    }, (response, error, success) => {
    });
});
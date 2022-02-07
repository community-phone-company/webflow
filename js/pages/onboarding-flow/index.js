$("#troubleshooting-link").on("click", (event) => {
    var clickCount = Store.local.read(
        Store.keys.onboardingFlow.troubleshootingLinkClickCount
    ) ?? 0;
    
    clickCount++;
    
    Store.local.write(
        Store.keys.onboardingFlow.troubleshootingLinkClickCount,
        clickCount
    );

    GoogleDocIntegration.addLineToOnboarding({
        email: state.email,
        troubleshootingLinkClickCount: clickCount
    }, (response, error, success) => {
    });
});
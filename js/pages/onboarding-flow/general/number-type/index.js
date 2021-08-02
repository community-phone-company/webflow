$(document).ready(() => {

    const email = Store.local.read(
        Store.keys.onboardingFlow.email
    );

    if (email) {
        HotjarIntegration.send({
            "Email": email
        });
    }
});
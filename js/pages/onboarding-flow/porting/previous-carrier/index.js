$(document).ready(() => {

    const formData = {
        email: Store.local.read(
            Store.keys.onboardingFlow.email
        ),
        selectedCarrier: undefined
    };

    $("div.w-dyn-item").on("click", (event) => {
        formData.selectedCarrier = event.currentTarget.querySelectorAll("div.body-2.color-text")[0].innerText;
    });

    $("div.w-dyn-item div.popup a.w-inline-block").on("click", (event) => {
        event.preventDefault();
        const link = event.currentTarget;

        GoogleDocIntegration.addLineToOnboarding(
            formData.email,
            formData.selectedCarrier,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            (response, error, success) => {
                window.location.href = link.href;
            }
        )
    });
});
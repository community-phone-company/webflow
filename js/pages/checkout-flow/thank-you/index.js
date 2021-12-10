const page = {
    elements: {
        selectedPhoneNumberLink: document.getElementById("selected-phone-number-link"),
        selectedPhoneNumberText: document.getElementById("selected-phone-number-text")
    },
    data: {
        selectedPhoneNumber: (() => {
            const serialized = Store.local.read(
                Store.keys.checkoutFlow.selectedPhoneNumber
            );
            return typeof serialized === "string"
                ? PhoneNumber.deserialize(serialized)
                : undefined;
        })(),
        fromUrlParameters: (() => {
            const data = router.getParameterValue("data");

            if (typeof data === "string") {
                return JSON.parse(
                    atob(
                        data
                    )
                );
            } else {
                return undefined;
            }
        })()
    }
};

const setupUI = () => {
    if (page.data.fromUrlParameters) {
        console.log(`Data from parameters: `, page.data.fromUrlParameters);
    } else if (page.data.selectedPhoneNumber) {
        $(page.elements.selectedPhoneNumberLink).attr(
            "href",
            `tel:+1${page.data.selectedPhoneNumber.formatted(PhoneNumberFormatStyle.regular)}`
        );
        $(page.elements.selectedPhoneNumberText).html(
            page.data.selectedPhoneNumber.formatted(PhoneNumberFormatStyle.brackets)
        );
        $(page.elements.selectedPhoneNumberLink).show();
    }
};

$(document).ready(() => {
    setupUI();
});
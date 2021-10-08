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
        })()
    }
};

const setupUI = () => {
    if (IS_PRODUCTION) {
        return;
    }

    if (page.data.selectedPhoneNumber) {
        $(page.elements.selectedPhoneNumberLink).attr(
            "href",
            `+1${page.data.selectedPhoneNumber.formatted(PhoneNumberFormatStyle.regular)}`
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
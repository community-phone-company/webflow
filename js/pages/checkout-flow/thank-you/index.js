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

/**
 * @param {PhoneNumber} phoneNumber 
 */
const showPhoneNumber = (phoneNumber) => {
    $(page.elements.selectedPhoneNumberLink).attr(
        "href",
        `tel:+1${phoneNumber.formatted(PhoneNumberFormatStyle.regular)}`
    );
    $(page.elements.selectedPhoneNumberText).html(
        phoneNumber.formatted(PhoneNumberFormatStyle.brackets)
    );
    $(page.elements.selectedPhoneNumberLink).show();
};

const setupUI = () => {
    if (page.data.fromUrlParameters) {
        console.log(`Data from parameters: `, page.data.fromUrlParameters);

        if (page.data.fromUrlParameters.showExample) {
            showPhoneNumber(
                new PhoneNumber(
                    "123",
                    "4567890"
                )
            );
        }
    } else {
        if (page.data.selectedPhoneNumber) {
            showPhoneNumber(
                page.data.selectedPhoneNumber
            );
        }
    }
};

$(document).ready(() => {
    setupUI();
});
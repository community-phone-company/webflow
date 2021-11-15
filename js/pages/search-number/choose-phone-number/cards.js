/**
 * @param {PhoneNumber} phoneNumber 
 * @returns {string}
 */
const getHtmlForCard = (phoneNumber) => {
    return `
        <div class="div-phone-number">
            <div class="div-block-21">
                <div class="div-radio-button-2">
                </div>
                <div class="_w-8">
                </div>
                <div class="txt-phone-number-2">
                    ${(() => {
                        return phoneNumber.formatted(
                            PhoneNumberFormatStyle.brackets
                        );
                    })()}
                </div>
            </div>
            <div class="txt-lacation-2">
                Portland, OR
                ${(() => {
                    if (phoneNumber.city && phoneNumber.stateCode) {
                        return `${phoneNumber.city}, ${phoneNumber.stateCode}`;
                    } else {
                        return ``;
                    }
                })()}
            </div>
        </div>
        <div class="devider-8px">
        </div>
    `;
};

/**
 * @param {HTMLElement} card 
 * @param {boolean} deselectOtherCards 
 */
const selectCard = (card, deselectOtherCards) => {
    const selectedCardClass = "radio-selected";
    $(".div-phone-number").removeClass(
        selectedCardClass
    );
    $(card).addClass(
        selectedCardClass
    );
}
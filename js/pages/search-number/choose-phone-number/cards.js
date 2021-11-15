/**
 * @param {PhoneNumber} phoneNumber 
 * @returns {string}
 */
const getCardHtmlForPhoneNumber = (phoneNumber) => {
    return `
        <div class="div-phone-number" community-phone-phone-number="${phoneNumber.serialize()}">
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
 * @returns {PhoneNumber}
 */
const getPhoneNumberFromCard = (card) => {
    const serializedPhoneNumber = $(card).attr("community-phone-phone-number");
    return PhoneNumber.deserialize(
        serializedPhoneNumber
    );
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
};

/**
 * @param {((selectedPhoneNumber: PhoneNumber) => void) | undefined} onSelectedCard 
 */
const setupCards = (onSelectedCard) => {
    $(".div-phone-number").off("click").on("click", (event) => {
        event.preventDefault();
        const selectedCard = event.currentTarget;

        const selectedCardClass = "radio-selected";
        $(".div-phone-number .div-radio-button-2").removeClass(
            selectedCardClass
        );
        $(selectedCard).find(".div-radio-button-2").addClass(
            selectedCardClass
        );

        if (onSelectedCard) {
            const selectedPhoneNumber = getPhoneNumberFromCard(
                selectedCard
            );
            onSelectedCard(
                selectedPhoneNumber
            );
        }
    });
};
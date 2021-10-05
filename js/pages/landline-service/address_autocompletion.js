/**
 * @returns {HTMLElement}
 */
const getAddressAutocompletionContainer = () => {
    return document.querySelectorAll("#service-address-autocomplete-suggestions-container")[0];
};

/**
 * @param {AddressSuggestion} addressSuggestion 
 * @param {string} highlightedSubstring 
 * @returns {string}
 */
const getHtmlForAddressAutocompletionItem = (addressSuggestion, highlightedSubstring) => {
    const address = `${addressSuggestion.primaryLine}, ${addressSuggestion.city}, ${addressSuggestion.state} ${addressSuggestion.zipCode}`;
    return `
        <div class="autocomplete-item" address-suggestion="${addressSuggestion.serialize()}">
            <div class="highlited-autocomplete-label">
                ${address.replaceAll(
                    highlightedSubstring,
                    `<span class="autocomplete-label">${highlightedSubstring}</span>`
                )}
            </div>
        </div>
    `;
}

/**
 * @param {HTMLElement} element 
 * @returns {AddressSuggestion}
 */
const getAddressSuggestionFromAutocompletionItem = (element) => {
    const serialized = $(element).attr("address-suggestion");
    return AddressSuggestion.deserialize(
        serialized
    );
};

/**
 * @param {string[]} addresses 
 * @param {string} highlightedSubstring 
 * @param {(suggestion: AddressSuggestion) => void} onSuggestionSelected
 */
const setAutocompletionItems = (addresses, highlightedSubstring, onSuggestionSelected) => {
    const container = getAddressAutocompletionContainer();

    if (addresses.length) {
        const html = addresses
            .map(address => {
                return getHtmlForAddressAutocompletionItem(
                    address,
                    highlightedSubstring
                );
            })
            .reduce(
                (previous, current) => `${previous}${current}`,
                ""
            );
        $(container).show();
        $(container).html(html);

        $(".autocomplete-item").off().on("click", (event) => {
            event.preventDefault();
            const selectedItem = event.currentTarget;
            const selectedAddressSuggestion = getAddressSuggestionFromAutocompletionItem(
                selectedItem
            );
            
            if (onSuggestionSelected) {
                onSuggestionSelected(
                    selectedAddressSuggestion
                );
            }
        });
    } else {
        $(container).hide();
        $(container).html(``);
    }
};
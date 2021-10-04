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
        <div class="autocomplete-item">
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
 * @param {string[]} addresses 
 * @param {string} highlightedSubstring 
 * @param {}
 */
const setAutocompletionItems = (addresses, highlightedSubstring) => {
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
    } else {
        $(container).hide();
        $(container).html(``);
    }
};
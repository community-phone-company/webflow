/**
 * @returns {HTMLElement}
 */
const getAddressAutocompletionContainer = () => {
    return document.querySelectorAll("#service-address-autocomplete-suggestions-container")[0];
};

/**
 * @param {string} address 
 * @param {string} highlightedSubstring 
 * @returns {string}
 */
const getHtmlForAddressAutocompletionItem = (address, highlightedSubstring) => {
    return `
        <div class="autocomplete-item">
            <div class="highlited-autocomplete-label">
                ${address}
            </div>
        </div>
    `.replaceAll(
        highlightedSubstring,
        `<span class="autocomplete-label">${highlightedSubstring}</span>`
    );
}

/**
 * @param {string[]} addresses 
 * @param {string} highlightedSubstring 
 */
const setAutocompletionItems = (addresses, highlightedSubstring) => {
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
    $(getAddressAutocompletionContainer()).html(html);
};
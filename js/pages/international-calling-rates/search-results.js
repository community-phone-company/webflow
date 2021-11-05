/**
 * @param {CountryCallRate} countryCallRate 
 * @param {"grey" | "white"} color
 * @returns {string}
 */
const getHtmlForCountrySearchResultItem = (countryCallRate, color) => {
    const minRate = Math.formatPrice(
        countryCallRate.minRate,
        true
    );
    const maxRate = Math.formatPrice(
        countryCallRate.maxRate,
        true
    );
    return `
        <div class="country-item-${color}">
            <img src="${countryCallRate.getCountryFlagUrl("png")}" loading="lazy" alt="" class="flag">
            <div class="_w-20">
            </div>
            <div class="text">
                <div class="left-labels">
                    <div class="body-2 color-text">
                        ${countryCallRate.countryName}
                    </div>
                    <div class="_w-8">
                    </div>
                    <div class="body-2">
                        (+${countryCallRate.phoneCode})
                    </div>
                </div>
                <div class="right-labels">
                    <div class="body-2">
                        $
                    </div>
                    <div class="_w-8">
                    </div>
                    <div class="body-2 color-text">
                        ${(() => {
                            if (minRate === maxRate) {
                                return `
                                    ${maxRate} USD
                                `;
                            } else {
                                return `
                                    ${minRate} — ${maxRate} USD
                                `;
                            }
                        })()}
                    </div>
                </div>
            </div>
        </div>
    `;
};

/**
 * @param {string} phoneNumber
 * @param {number} phoneCallRate
 * @param {CountryCallRate} countryCallRate
 * @returns {string}
 */
const getHtmlForNumberSearchResultItem = (phoneNumber, phoneCallRate, countryCallRate) => {
    const rate = Math.formatPrice(
        phoneCallRate,
        true
    );
    return `
        <div class="country-item-${color}">
            <img src="${countryCallRate.getCountryFlagUrl("png")}" loading="lazy" alt="" class="flag">
            <div class="_w-20">
            </div>
            <div class="text">
                <div class="left-labels">
                    <div class="body-2 color-text">
                        ${countryCallRate.countryName}
                    </div>
                    <div class="_w-8">
                    </div>
                    <div class="body-2">
                        (${phoneNumber})
                    </div>
                </div>
                <div class="right-labels">
                    <div class="body-2">
                        $
                    </div>
                    <div class="_w-8">
                    </div>
                    <div class="body-2 color-text">
                        ${phoneCallRate} USD
                    </div>
                </div>
            </div>
        </div>
    `;
};

/**
 * @param {string} letter 
 * @returns {string}
 */
const getHtmlForSearchResultsDivider = (letter) => {
    return `
        <div class="table-alphabet-devider">
            <div class="devider-56">
            </div>
            <div class="alphabet-label">
                ${letter}
            </div>
            <div class="devider-8px">
            </div>
        </div>
    `;
};

/**
 * 
 * @param {CountryCallRate[]} rates 
 * @returns {string}
 */
const getHtmlForCountrySearchResultsContent = (rates) => {
    const ratesSortedInAlphabetOrder = {};

    for (var rate of rates) {
        const countryFirstLetter = rate.countryName.substring(0, 1).toLowerCase();

        if (!ratesSortedInAlphabetOrder[countryFirstLetter]) {
            ratesSortedInAlphabetOrder[countryFirstLetter] = [];
        }

        ratesSortedInAlphabetOrder[countryFirstLetter].push(rate);
    }
    
    var html = ``;

    for (var letterCode = "a".charCodeAt(0); letterCode <= "z".charCodeAt(0); letterCode++) {
        const letter = String.fromCharCode(
            letterCode
        );
        const rates = ratesSortedInAlphabetOrder[letter];

        if (rates) {
            html += getHtmlForSearchResultsDivider(
                letter.toUpperCase()
            );
            rates.sort((a, b) => {
                const names = [
                    a.countryName.toLowerCase(),
                    b.countryName.toLowerCase()
                ];
                if (names[0] < names[1]) return -1;
                if (names[0] > names[1]) return 1;
                return 0;
            });

            for (var i = 0; i < rates.length; i++) {
                const rate = rates[i];
                html += getHtmlForCountrySearchResultItem(
                    rate,
                    i % 2 == 0 ? "grey" : "white"
                );
            }
        }
    }

    return html;
};

/**
 * @param {string} phoneNumber 
 * @param {number} phoneCallRate 
 * @param {CountryCallRate} countryCallRate 
 * @returns {string}
 */
const getHtmlForNumberSearchResultsContent = (phoneNumber, phoneCallRate, countryCallRate) => {
    return getHtmlForNumberSearchResultItem(
        phoneNumber,
        phoneCallRate,
        countryCallRate
    );
};
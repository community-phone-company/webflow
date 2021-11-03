/**
 * 
 * @param {CountryCallRate} rate 
 * @param {"grey" | "white"} color
 * @returns {string}
 */
const getHtmlForSearchResultItem = (rate, color) => {
    return `
        <div class="country-item-${color}">
            <img src="https://assets.website-files.com/60c30ab447d78d3beb1f6c82/618174cd3fd07d600952ee25_AF.svg" loading="lazy" alt="" class="flag">
            <div class="_w-20">
            </div>
            <div class="text">
                <div class="left-labels">
                    <div class="body-2 color-text">
                        ${rate.countryName}
                    </div>
                    <div class="_w-8">
                    </div>
                    <div class="body-2">
                        (+${rate.countryCode})
                    </div>
                </div>
                <div class="right-labels">
                    <div class="body-2">
                        $
                    </div>
                    <div class="_w-8">
                    </div>
                    <div class="body-2 color-text">
                        ${rate.minRate} — ${rate.maxRate} USD
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
    return `
    `;
};
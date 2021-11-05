const page = {
    ui: {
        searchForm: document.getElementById("search-form"),
        searchField: document.getElementById("search-field"),
        searchResultsContainer: document.getElementById("search-results-container")
    },
    state: {
        lastSearchRequest: undefined,
        callRates: [],
        filteredCallRates: [],
        searchQuery: ""
    }
};

/**
 * @param {(() => void) | undefined} callback 
 */
const updateCountryCallRates = (callback) => {
    getInternationalCallRatesForAllCountries((rates, error) => {
        page.state.callRates = rates;

        if (callback) {
            callback();
        }
    });
};

const setupUI = () => {
    UserInterface.makeFormUnsubmittable(
        page.ui.searchForm
    );
    page.ui.searchField.oninput = () => {
        page.state.searchQuery = page.ui.searchField.value;
        onSearchQueryChanged();
    };
};

const onSearchQueryChanged = () => {
    const searchQuery = page.state.searchQuery;

    const updateSearchResultsContainer = () => {
        const html = getHtmlForCountrySearchResultsContent(
            page.state.filteredCallRates
        );
        $(page.ui.searchResultsContainer).html(html);
    };
    
    if (searchQuery.length) {
        const isPhoneNumber = /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g.test(
            searchQuery
        );

        if (isPhoneNumber) {
            getInternationalCallRateForPhoneNumber(
                searchQuery,
                (phoneCallRate, countryCallRate, error) => {
                    if (error) {
                    } else {
                        page.state.filteredCallRates = [
                            countryCallRate
                        ];
                    }

                    updateSearchResultsContainer();
                }
            );
        } else {
            page.state.filteredCallRates = page.state.callRates.filter(rate => {
                return rate.countryName.toLowerCase().includes(
                    searchQuery.toLowerCase()
                );
            });
            updateSearchResultsContainer();
        }
    } else {
        page.state.filteredCallRates = page.state.callRates;
        updateSearchResultsContainer();
    }
};

$(document).ready(() => {
    setupUI();
    updateCountryCallRates(() => {
        onSearchQueryChanged();
        $(page.ui.searchResultsContainer).show();
    });
});
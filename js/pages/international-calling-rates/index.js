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
    
    if (searchQuery.length) {
        page.state.filteredCallRates = page.state.callRates.filter(rate => {
            return rate.countryName.toLowerCase().includes(
                searchQuery.toLowerCase()
            );
        });
    } else {
        page.state.filteredCallRates = page.state.callRates;
    }
    
    const html = getHtmlForCountrySearchResultsContent(
        page.state.filteredCallRates
    );
    $(page.ui.searchResultsContainer).html(html);
};

$(document).ready(() => {
    setupUI();
    updateCountryCallRates(() => {
        onSearchQueryChanged();
    });
});
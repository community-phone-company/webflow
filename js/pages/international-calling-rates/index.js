const page = {
    ui: {
        searchForm: document.getElementById("search-form"),
        searchField: document.getElementById("search-field"),
        searchResultsContainer: document.getElementById("search-results-container")
    },
    state: {
        lastSearchRequest: undefined,
        callRates: [],
        search: {
            query: "",
            isPhoneNumber: false,
            country: {
                filteredCallRates: [],
            },
            phoneNumber: {
                value: undefined,
                callRate: undefined,
                country: undefined
            }
        },
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
        page.state.search.query = page.ui.searchField.value;
        onSearchQueryChanged();
    };
};

const onSearchQueryChanged = () => {
    const searchQuery = page.state.search.query;

    const updateSearchResultsContainer = () => {
        const html = (() => {
            if (page.state.search.isPhoneNumber) {
                return getHtmlForNumberSearchResultsContent(
                    page.state.search.phoneNumber.value,
                    page.state.search.phoneNumber.callRate,
                    page.state.search.phoneNumber.country
                );
            } else {
                return getHtmlForCountrySearchResultsContent(
                    page.state.search.country.filteredCallRates
                );
            }
        })();
        $(page.ui.searchResultsContainer).html(
            html
        );
    };
    
    if (searchQuery.length) {
        const isPhoneNumber = /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g.test(
            searchQuery
        );
        page.state.search.isPhoneNumber = isPhoneNumber;

        if (isPhoneNumber) {
            const phoneNumber = searchQuery
                .replaceAll(" ", "")
                .replaceAll("(", "")
                .replaceAll(")", "");
            page.state.search.phoneNumber.value = phoneNumber;

            getInternationalCallRateForPhoneNumber(
                phoneNumber,
                (phoneCallRate, countryCallRate, error) => {
                    if (error) {
                    } else {
                        page.state.search.phoneNumber.callRate = phoneCallRate;
                        page.state.search.phoneNumber.country = countryCallRate;
                    }

                    updateSearchResultsContainer();
                }
            );
        } else {
            page.state.search.country.filteredCallRates = page.state.callRates.filter(rate => {
                return rate.countryName.toLowerCase().includes(
                    searchQuery.toLowerCase()
                );
            });
            updateSearchResultsContainer();
        }
    } else {
        page.state.search.country.filteredCallRates = page.state.callRates;
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
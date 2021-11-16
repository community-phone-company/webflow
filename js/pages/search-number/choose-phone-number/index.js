const page = {
    ui: {
        byAreaCodeSwitcher: document.getElementById("filter-by-area-code"),
        byTollFreeSwitcher: document.getElementById("filter-by-toll-free"),
        filtersForm: document.getElementById("search-form"),
        stateInput: document.getElementById("state-input"),
        areaCodeInput: document.getElementById("area-code-input"),
        digitsInput: document.getElementById("digits-input"),
        numbersContainer: document.getElementById("list-of-numbers"),
        showMoreButtonContainer: document.getElementById("show-more-button-container"),
        showMoreButton: document.getElementById("show-more-button"),
        showMoreAnimationContainer: document.getElementById("show-more-button-animation"),
        checkCoverageContainer: document.getElementById("check-coverage-container"),
        checkCoverageButton: document.getElementById("check-coverage-button")
    },
    data: {
        searchForm: {
            state: "",
            areaCode: "",
            digits: "",
            isTollFree: false
        },
        numbers: {
            availableNumbers: [],
            currentPage: 0,
            pageSize: 10,
            lastRequest: undefined,
            selectedNumber: undefined
        }
    }
};

const setupSearchForm = () => {
    const switchers = [
        page.ui.byAreaCodeSwitcher,
        page.ui.byTollFreeSwitcher
    ];
    const currentTabClassName = "current-tab";
    switchers.forEach(selectedSwitcher => {
        $(selectedSwitcher).on("click", () => {
            $(switchers).removeClass(
                currentTabClassName
            );
            $(selectedSwitcher).addClass(
                currentTabClassName
            );
            
            page.data.searchForm.isTollFree = selectedSwitcher == page.ui.byTollFreeSwitcher;
            onSearchFormChanged();
        });
    });

    new InputValueObserver(page.ui.stateInput).startObserving(newValue => {
        page.data.searchForm.state = newValue;
        onSearchFormChanged();
    });

    new InputValueObserver(page.ui.areaCodeInput).startObserving(newValue => {
        page.data.searchForm.areaCode = newValue;
        onSearchFormChanged();
    });

    new InputValueObserver(page.ui.digitsInput).startObserving(newValue => {
        page.data.searchForm.digits = newValue;
        onSearchFormChanged();
    });
};

const onSearchFormChanged = () => {
    page.data.numbers.availableNumbers = [];
    page.data.numbers.currentPage = 0;
    clearNumbersContainer();
    loadNextPage(() => {
    });
    setCheckCoverageButtonEnabled(
        false
    );
};

/**
 * @param {number} pageIndex
 * @param {(numbers: PhoneNumber[], error: any) => void} callback 
 */
const loadPhoneNumbers = (pageIndex, callback) => {
    if (page.data.numbers.lastRequest) {
        page.data.numbers.lastRequest.abort();
    }

    page.data.numbers.lastRequest = PhoneNumberManager.getNumbers(
        "",
        page.data.searchForm.state,
        page.data.searchForm.areaCode,
        page.data.searchForm.digits,
        page.data.searchForm.isTollFree,
        new Paging(
            pageIndex,
            page.data.numbers.pageSize
        ),
        (numbers, error) => {
            if (callback) {
                callback(
                    numbers,
                    error
                );
            }
        }
    );
};

/**
 * @param {((loaded: boolean) => void) | undefined} callback 
 */
const loadNextPage = (callback) => {
    const nextPageIndex = page.data.numbers.currentPage + 1;
    
    loadPhoneNumbers(nextPageIndex, (numbers, error) => {
        if (error || !numbers.length) {
            if (callback) {
                callback(
                    false
                );
            }
        } else {
            page.data.numbers.availableNumbers = page.data.numbers.availableNumbers.concat(
                numbers
            );
            page.data.numbers.currentPage++;
            
            setNumbersInContainer(
                page.data.numbers.availableNumbers
            );

            setupCards((selectedPhoneNumber) => {
                page.data.numbers.selectedNumber = selectedPhoneNumber;

                setCheckCoverageButtonEnabled(
                    true
                );
            });

            if (callback) {
                callback(
                    true
                );
            }
        }
    });
};

const clearNumbersContainer = () => {
    $(page.ui.numbersContainer).html(``);
};

/**
 * @param {PhoneNumber[]} phoneNumbers 
 */
const setNumbersInContainer = (phoneNumbers) => {
    const html = phoneNumbers
        .map(el => {
            return getCardHtmlForPhoneNumber(el);
        })
        .reduce(
            (previous, current) => {
                return `${previous}${current}`;
            },
            ``
        );
    $(page.ui.numbersContainer).html(html);
};

/**
 * @param {boolean} animated 
 */
const setShowMoreButtonAnimated = (animated) => {
    if (animated) {
        $(page.ui.showMoreButtonContainer).hide();
        $(page.ui.showMoreAnimationContainer).show();
    } else {
        $(page.ui.showMoreButtonContainer).show();
        $(page.ui.showMoreAnimationContainer).hide();
    }
};

/**
 * @param {boolean} enabled
 */
const setCheckCoverageButtonEnabled = (enabled) => {
    if (enabled) {
        $(page.ui.checkCoverageContainer).show();
    } else {
        $(page.ui.checkCoverageContainer).hide();
    }
};

const setupUI = () => {
    setupSearchForm();

    $(page.ui.showMoreButton).on("click", () => {
        setShowMoreButtonAnimated(
            true
        );
        loadNextPage(() => {
            setShowMoreButtonAnimated(
                false
            );
        });
    });

    setCheckCoverageButtonEnabled(
        false
    );
    $(page.ui.checkCoverageButton).on("click", () => {
    });
};

$(document).ready(() => {
    setupUI();
    onSearchFormChanged();
});
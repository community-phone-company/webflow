const page = {
    ui: {
        byAreaCodeSwitcher: document.getElementById("filter-by-area-code"),
        byTollFreeSwitcher: document.getElementById("filter-by-toll-free"),
        filtersForm: document.getElementById("search-form"),
        stateSelect: document.querySelectorAll(".state select")[0],
        areaCodeSelect: document.querySelectorAll(".area-code select")[0],
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

const setupStateSelect = () => {
    const defaultOption = {
        label: "All states",
        value: ""
    };
    const stateOptions = [
        defaultOption
    ].concat(
        getAllStates().map(el => {
            return {
                label: el.name,
                value: el.code
            };
        })
    );
    $(page.ui.stateSelect).html(
        stateOptions
            .map(el => {
                return `<option value="${el.value}">${el.label}</option>`;
            })
            .reduce((previous, current) => `${previous}${current}`, ``)
    );
};

const setupAreaCodeSelect = () => {
    const stateCode = page.data.searchForm.state;
    const areaCodes = (() => {
        if (stateCode.length) {
            return getAreaCodesByStateCode(
                stateCode
            );
        } else {
            return getAllAreaCodes();
        }
    })();
    const defaultOption = {
        label: "",
        value: ""
    };
    const options = [
        defaultOption
    ].concat(
        areaCodes.map(el => {
            return {
                label: el,
                value: el
            };
        })
    );
    $(page.ui.areaCodeSelect).html(
        options
            .map(el => {
                return `<option value="${el.value}">${el.label}</option>`;
            })
            .reduce((previous, current) => `${previous}${current}`, ``)
    );
};

const setupSearchForm = () => {
    setupStateSelect();
    setupAreaCodeSelect();

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

    page.ui.stateSelect.oninput = () => {
        page.data.searchForm.state = page.ui.stateSelect.value;
        page.data.searchForm.areaCode = "";
        page.ui.areaCodeSelect.value = "";
        setupAreaCodeSelect();
        onSearchFormChanged();
    };

    page.ui.areaCodeSelect.oninput = () => {
        page.data.searchForm.areaCode = page.ui.areaCodeSelect.value;
        page.data.searchForm.state = "";
        page.ui.stateSelect.value = "";
        onSearchFormChanged();
    };
    page.ui.areaCodeSelect.value = Store.local.read(
        Store.keys.numberSearch.selectedAreaCode,
        ""
    );
    Store.local.write(
        Store.keys.numberSearch.selectedAreaCode,
        undefined
    );

    new InputValueObserver(page.ui.digitsInput).startObserving(newValue => {
        page.data.searchForm.digits = newValue;
        onSearchFormChanged();
    });
    page.ui.digitsInput.value = Store.local.read(
        Store.keys.numberSearch.selectedDigits,
        ""
    );
    Store.local.write(
        Store.keys.numberSearch.selectedDigits,
        undefined
    );
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
            page.data.numbers.selectedNumber = undefined;

            setNumbersInContainer(
                page.data.numbers.availableNumbers
            );

            setupCards((selectedPhoneNumber) => {
                page.data.numbers.selectedNumber = selectedPhoneNumber;

                setCheckCoverageButtonEnabled(
                    true
                );
            });

            setCheckCoverageButtonEnabled(
                false
            );

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
        const selectedPhoneNumber = page.data.numbers.selectedNumber;

        if (selectedPhoneNumber) {
            Store.local.write(
                Store.keys.checkoutFlow.selectedPhoneNumber,
                selectedPhoneNumber.serialize()
            );
            router.open(
                RouterPath.checkCoverage_serviceAddress,
                undefined,
                router.isTestEnvironment()
            );
        }
    });

    $(page.ui.numbersContainer)
        .html(``)
        .show();
};

$(document).ready(() => {
    setupUI();
    onSearchFormChanged();
});
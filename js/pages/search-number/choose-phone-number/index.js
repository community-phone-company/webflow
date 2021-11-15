const page = {
    ui: {
        byAreaCodeSwitcher: document.getElementById("filter-by-area-code"),
        byTollFreeSwitcher: document.getElementById("filter-by-toll-free"),
        filtersForm: document.getElementById("search-form"),
        stateInput: document.getElementById("state-input"),
        areaCodeInput: document.getElementById("area-code-input"),
        digitsInput: document.getElementById("digits-input"),
        numbersContainer: document.getElementById("list-of-numbers"),
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
            lastRequest: undefined
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
};

/**
 * @param {(numbers: PhoneNumber[], error: any) => void} callback 
 */
const loadPhoneNumbers = (callback) => {
    if (page.data.numbers.lastRequest) {
        page.data.numbers.lastRequest.abort();
    }

    page.data.numbers.lastRequest = PhoneNumberManager.getNumbers(
        "",
        page.data.searchForm.state,
        page.data.searchForm.areaCode,
        page.data.searchForm.digits,
        page.data.searchForm.isTollFree,
        (numbers, error) => {
            page.data.numbers.availableNumbers = numbers;

            if (callback) {
                callback(
                    numbers,
                    error
                );
            }
        }
    );
};

const clearNumbersContainer = () => {
    $(page.ui.numbersContainer).html(``);
};

/**
 * @param {PhoneNumber[]} phoneNumbers 
 */
const addNumbersToContainer = (phoneNumbers) => {
    const html = phoneNumbers
        .map(el => {
            return getCardHtmlForPhoneNumber(el);
        })
        .reduce(
            (previous, current) => {
                return `${previous}${current}`;
            },
            ""
        );
    $(page.ui.numbersContainer).html(html);
};

const setupUI = () => {
    setupSearchForm();
    setupCards((selectedPhoneNumber) => {
        console.log(`Selected phone number: ${selectedPhoneNumber.formatted(PhoneNumberFormatStyle.brackets)}`);
    });
};

$(document).ready(() => {
    setupUI();
});
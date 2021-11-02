const page = {
    ui: {
        searchForm: document.getElementById("search-form"),
        searchField: document.getElementById("search-field")
    },
    state: {
        lastSearchRequest: undefined,
        searchQuery: ""
    }
};

const setupUI = () => {
    UserInterface.makeFormUnsubmittable(
        page.ui.searchForm
    );
    page.ui.searchField.oninput = () => {
        page.state.searchQuery = page.ui.searchField.value;
        onDataChanged();
    };
};

const onDataChanged = () => {
    console.log(
        page.state
    );
};

$(document).ready(() => {
    setupUI();
});
const page = {
    ui: {
        searchForm: document.getElementById("search-form"),
        searchField: document.getElementById("search-field")
    },
    data: {
        searchQuery: ""
    }
};

const setupUI = () => {
    UserInterface.makeFormUnsubmittable(
        page.ui.searchForm
    );
    page.ui.searchField.oninput = () => {
        page.data.searchQuery = page.ui.searchField.value;
        onDataChanged();
    };
};

const onDataChanged = () => {
    console.log(
        page.data
    );
};

$(document).ready(() => {
    setupUI();
});
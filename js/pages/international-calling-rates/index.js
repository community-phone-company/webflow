const page = {
    ui: {
        searchField: document.getElementById("search-field")
    },
    data: {
        searchQuery: ""
    }
};

const setupUI = () => {
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
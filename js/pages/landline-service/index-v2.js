const DID_CLICK_MAIN_BUTTON_KEY = "landline-page-did-click-main-button";

const didClickMainButton = () => {
    const value = localStorage.getItem(
        DID_CLICK_MAIN_BUTTON_KEY
    );
    return typeof value === "string" ? value.toLowerCase() === "true" : false;
}

/**
 * @param {boolean} clicked 
 */
const setClickedMainButton = (clicked) => {
    localStorage.setItem(
        DID_CLICK_MAIN_BUTTON_KEY,
        String(clicked)
    );
}

const getMainButtonText = () => {
    return didClickMainButton()
        ? "Check your address for coverage"
        : "Click to learn more";
}

const setupUI = () => {
    const buttons = Array.from(
        $(".check-coverage-button")
    );
    const mainButton = $(".main-check-coverage-button")[0];
    mainButton.innerText = getMainButtonText();

    $(mainButton).on("click", event => {
        if (!didClickMainButton()) {
            event.preventDefault();
            setClickedMainButton(
                true
            );
            mainButton.innerText = getMainButtonText();
        }
    });
};

setupUI();
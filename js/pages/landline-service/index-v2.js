sendEventToAmplitude(
    "Open landline page"
);

const DID_CLICK_MAIN_BUTTON_KEY = "landline-page-did-click-main-button";

/**
 * @returns {boolean}
 */
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

/**
 * @param {boolean} isClicked 
 * @returns {string}
 */
const getMainButtonText = (
    isClicked
) => {
    return isClicked
        ? "Check your address for coverage"
        : "Click to learn more";
}

const scrollToHeaderSection = () => {
    const headerSection = $("#header-section")[0];
    
    if (headerSection) {
        headerSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

const setupUI = () => {
    const buttons = Array.from(
        $(".check-coverage-button")
    );
    $(buttons).on("click", event => {
        sendEventToAmplitude(
            "Clicked CTA button"
        );
    });

    const mainButton = $(".main-check-coverage-button")[0];
    
    if (mainButton) {
        mainButton.innerText = getMainButtonText(
            didClickMainButton()
        );
    
        $(mainButton).on("click", event => {
            if (!didClickMainButton()) {
                event.preventDefault();
                scrollToHeaderSection();
                setClickedMainButton(
                    true
                );
                mainButton.innerText = getMainButtonText(
                    true
                );
            }
        });
    }
};

setupUI();
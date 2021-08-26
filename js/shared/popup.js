/**
 * Represents a typical popup message
 * that is used on different pages.
 */
class Popup {

    /**
     * 
     * @param {HTMLElement | string} container Popup container. Should be an `HTMLElement` instance or a string containing selector.
     */
    constructor(container) {
        if (container instanceof HTMLElement) {
            this._container = container;
        } else if (typeof container === "string") {
            const containerElement = document.querySelectorAll(container)[0];

            if (!containerElement) {
                throw new Error(`Popup container not found with selector: ${container}`);
            }

            this._container = containerElement;
        } else {
            throw new Error(`Popup container not found`);
        }

        this._userInterface = Object.freeze({
            closeButton: this._container.querySelectorAll("div.title-popup .ic-close")[0],
            title: this._container.querySelectorAll(".popup-title")[0],
            body: this._container.querySelectorAll(".popup-body")[0],
            ctaButton: this._container.querySelectorAll(".popup-cta-button")[0]
        });

        this._setupUserInterface();
    }

    _setupUserInterface = () => {
        const _this = this;
        
        $(this._userInterface.closeButton).on("click", (event) => {
            event.preventDefault();
            _this.hide();
        });

        $(this._userInterface.ctaButton).on("click", (event) => {
            event.preventDefault();

            if (this._onCTAButtonClicked) {
                this._onCTAButtonClicked();
            }
        });
    }

    /**
     * @returns {string}
     */
    getTitle = () => {
        return $(this._userInterface.title).html();
    }

    /**
     * @param {string} title 
     */
    setTitle = (title) => {
        $(this._userInterface.title).html(title);
    }

    /**
     * @returns {string}
     */
    getBody = () => {
        return $(this._userInterface.body).html();
    }

    /**
     * @param {string} html 
     */
    setBody = (html) => {
        $(this._userInterface.body).html(html);
    }

    show = () => {
        $(this._container)
            .stop()
            .css("display", "block")
            .fadeTo(
                300,
                1,
                () => {
                }
            );
    }

    hide = () => {
        const container = this._container;
        $(container)
            .stop()
            .fadeTo(
                300,
                0,
                () => {
                    $(container).css("display", "none");
                }
            );
    }

    /**
     * @param {() => void} handler 
     */
    onCTAButtonClicked = (handler) => {
        this._onCTAButtonClicked = handler;
    }
}
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
            background: this._container.querySelectorAll(".fade div.popup-bg")[0],
            closeButton: this._container.querySelectorAll(".ic-close")[0],
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

            if (_this._onCTAButtonClicked) {
                _this._onCTAButtonClicked(
                    _this
                );
            } else {
                this.hide();
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
     * @returns {Popup} Current {@link Popup} instance.
     */
    setTitle = (title) => {
        $(this._userInterface.title).html(title);
        return this;
    }

    /**
     * @returns {string}
     */
    getBody = () => {
        return $(this._userInterface.body).html();
    }

    /**
     * @param {string} html 
     * @returns {Popup} Current {@link Popup} instance.
     */
    setBody = (html) => {
        $(this._userInterface.body).html(html);
        return this;
    }

    /**
     * @returns {string}
     */
    getCTAButtonTitle = () => {
        return $(this._userInterface.ctaButton).html();
    }

    /**
     * @param {string} title 
     * @returns {Popup} Current {@link Popup} instance.
     */
    setCTAButtonTitle = (title) => {
        $(this._userInterface.ctaButton).html(title);
        return this;
    }

    /**
     * @param {(popup: Popup) => void} handler 
     * @returns {Popup} Current {@link Popup} instance.
     */
    onCTAButtonClicked = (handler) => {
        this._onCTAButtonClicked = handler;
        return this;
    }

    /**
     * @param {(() => void) | undefined} callback Function that is called when animation has finished.
     * @returns {Popup} Current {@link Popup} instance.
     */
    show = (callback) => {
        $(this._userInterface.background).css("opacity", 1);
        $(this._container)
            .stop()
            .css("display", "block")
            .fadeTo(300, 1, () => {
                if (callback) {
                    callback();
                }
            });
        return this;
    }

    /**
     * @param {(() => void) | undefined} callback Function that is called when animation has finished.
     * @returns {Popup} Current {@link Popup} instance.
     */
    hide = (callback) => {
        const container = this._container;
        $(container)
            .stop()
            .fadeTo(300, 0, () => {
                $(container).css("display", "none");
                
                if (callback) {
                    callback();
                }
            });
        return this;
    }
}
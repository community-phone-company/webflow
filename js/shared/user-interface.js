class UserInterface {

    /**
     * Enables or disables an element.
     * Supports buttons and text fields.
     * @param {HTMLElement} element `HTMLElement` instance.
     * @param {boolean} enabled Defines whether the element should be enabled or not.
     */
    static setElementEnabled = (element, enabled) => {
        if (enabled) {
            $(element).removeClass("disabled");
            $(element).attr("disabled", false);
        } else {
            $(element).addClass("disabled");
            $(element).attr("disabled", "disabled");
        }
    }

    /**
     * 
     * @param {HTMLElement} element `HTMLElement` instance.
     * @param {boolean} clickable Defines whether the element should be clickable or not.
     */
    static makeElementClickable = (element, clickable) => {
        $(element).css(
            "pointer-events",
            clickable ? "" : "none"
        );
    }

    /**
     * @param {HTMLFormElement} form 
     */
    static makeFormUnsubmittable = (form) => {
        $(form).submit((event) => {
            event.preventDefault();
            return false;
        });
    }

    /**
     * @param {HTMLElement} element 
     * @param {(event: any) => void} handler 
     */
    static onClick = (element, handler) => {
        const eventName = IS_MOBILE ? "tap" : "click";
        $(element).on(eventName, event => {
            event.preventDefault();
            handler(event);
        });
    }

    /**
     * @param {HTMLInputElement} element 
     */
    static forbidSpaceKeyForInput = (element) => {
        element.onkeypress = (event) => {
            const forbiddenKeys = ["Space"]; Î

            if (forbiddenKeys.includes(event.code)) {
                event.preventDefault();
            }
        }
    }

    /**
     * @param {boolean} scrollable 
     */
    static makePageScrollable = (scrollable) => {
        const body = $(document.body);
        var scrollPosition = 0;

        if (scrollable) {
            if (body.css("overflow") != "hidden") {
                scrollPosition = window.pageYOffset;
            }

            body.css("overflow", "");
            body.css("position", "");
            body.css("top", "");
            body.width("");
            $(window).scrollTop(scrollPosition);
        } else {
            const oldWidth = body.innerWidth();
            scrollPosition = window.pageYOffset;
            body.css("overflow", "hidden");
            body.css("position", "fixed");
            body.css("top", `-${scrollPosition}px`);
            body.width(oldWidth);
        }
    }
}
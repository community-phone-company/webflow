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
}
/**
 * Class made for a simple integration of Hotjar functionality.
 * 
 * Usage example:
 * 
 * ```
 * HotjarIntegration.send({
 *     HotjarUserCustomField.email: "user@google.com"
 * });
 * ```
 */
class HotjarIntegration {

    /**
     * Prepares Hotjar instance for usage and returns it.
     * @returns {any} Hotjar instance.
     */
    static getHotjar = () => {
        window.hj = window.hj || function() { (hj.q = hj.q || []).push(arguments); };
        return window.hj;
    }

    /**
     * Sends user's data to Hotjar service.
     * Also, you can use this method to assign ID, generated in browser, to Hotjar user.
     * @param {any} data JSON object containing any custom data.
     */
    static send = (data) => {
        const hotjar = this.getHotjar();
        hotjar(
            "identify",
            getOrCreateUserId(),
            data
        );
    }
}

/**
 * Enumeration of user custom fields.
 */
const HotjarUserCustomField = Object.freeze({
    email: "Email"
});
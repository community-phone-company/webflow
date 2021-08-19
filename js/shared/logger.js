/**
 * Logger with some additional functionality.
 */
class Logger {

    /**
     * @constructor
     */
    constructor() {
        this._blockedDomains = [];
        this._console_log = console.log;
    }

    /**
     * List of blocked domains.
     * @returns {string[]}
     */
    getBlockedDomains = () => {
        return this._blockedDomains;
    }

    /**
     * Sets list of blocked domains.
     * Calls to {@link print} will not work for pages from these domains.
     * 
     * Example of domain name: `google.com`.
     * 
     * To retrieve the current domain, use
     * ```
     * window.location.hostname
     * ```
     * @param  {string[]} domains Domains to block.
     */
    setBlockedDomains = (domains) => {
        this._blockedDomains = domains;
    }

    /**
     * Prints to the console.
     * @param  {...any} data Text to print.
     */
    print = (...data) => {
        const currentDomain = window.location.hostname;
        const isBlockedDomain = this._blockedDomains.includes(currentDomain);

        if (!isBlockedDomain) {
            console.log(...data);
        }
    }

    /**
     * Blocks or unblocks logging.
     * @param {boolean} enabled Defines whether logging is enabled.
     */
    setLoggingEnabled = (enabled) => {
        console.log = enabled
            ? this._console_log
            : () => {};
    }
}

const logger = new Logger();
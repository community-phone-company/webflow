/**
 * Enumeration of possible modes for {@link Store} instance.
 */
const StoreMode = Object.freeze({
    local: "local",
    session: "session"
});

/**
 * Enumeration for local storage keys.
 */
const StoreKey = Object.freeze({
    userId: "user-id"
});

/**
 * Represents a better interface for using `localStorage` and `sessionStorage`.
 * The regular `localStorage` and `sessionStorage` support only string values.
 * Using the `Store` class. you can read and write values of any type.
 * 
 * Example of usage:
 * 
 * ```
 * Store.local.write("user", {
 *     firstName: "John",
 *     lastName: "Appleseed"
 * });
 * 
 * Store.local.read("user") // {firstName: "John", lastName: "Appleseed"}
 * ```
 */
class Store {

    static local = new Store(StoreMode.local);

    static session = new Store(StoreMode.session);

    /**
     * @constructor
     * @param {string} mode Store mode. Use {@link StoreMode} for available modes.
     */
    constructor(mode) {
        this.internalStorage = (() => {
            switch (mode) {
                case StoreMode.local:
                    return window.localStorage;
                case StoreMode.session:
                    return window.sessionStorage;
            }
        })();
    }

    /**
     * Reads data from the storage.
     * @param {string} key String containing key that is used for storing value in the storage.
     * @returns {any | undefined}
     */
    read = (key) => {
        const jsonString = this.internalStorage.getItem(key);

        if (!jsonString) {
            return undefined;
        }

        const json = JSON.parse(jsonString);

        if (!json) {
            return undefined;
        }

        return json.value;
    }

    /**
     * Use this method to read values that were written by {@link localStorage.setItem} method.
     * Otherwise, use {@link Store.read} to read the value.
     * @param {string} key String containing key that is used for storing value in the storage.
     * @returns {string | undefined}
     */
    readLegacy = (key) => {
        return this.internalStorage.getItem(key) ?? undefined;
    }

    /**
     * Writes data to the storage.
     * @param {string} key String containing key that is used for storing value in the storage.
     * @param {any | undefined} value Value. Can be anything: string, number, boolean, object, etc.
     */
    write = (key, value) => {
        const json = {
            value: value
        };
        const jsonString = JSON.stringify(json);
        this.internalStorage.setItem(key, jsonString);
    }

    clear = () => {
        this.internalStorage.clear();
    }
}
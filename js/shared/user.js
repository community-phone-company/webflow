/**
 * Generates a unique user ID.
 * @returns {string} User ID.
 */
const createUserId = () => {
    const uuid = ([1e7]+-1e3+-4e3+-8e3+-1e11)
        .replace(
            /[018]/g,
            c => {
                return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
            }
        )
        .replace(
            /-/g,
            ""
        );
    const timestampString = Date.now().toString();
    return `${uuid}${timestampString}`;
};

/**
 * Reads user ID from local storage.
 * @returns {string | undefined} User ID or `undefined`.
 */
const getUserId = () => {
    return Store.local.read(StoreKey.userId);
};

/**
 * Reads user ID from local storage.
 * If there's no ID in the storage, creates and returns a new one.
 * @returns {string} User ID.
 */
const getOrCreateUserId = () => {
    const storedId = Store.local.read(StoreKey.userId);

    if (storedId) {
        return storedId;
    }

    const newId = createUserId();
    Store.local.write(StoreKey.userId, newId);
    return newId;
}

/**
 * Stores user ID.
 * @param {string} id String containing user ID.
 */
const setUserId = (id) => {
    Store.local.write(StoreKey.userId, id);
};
const URL_DATA_TRANSFER_PARAMETER_DEFAULT_NAME = "s";

/**
 * @param {{key: string, value: any}[]} items 
 * @returns {string}
 */
const encodeStorageItemsForTransferViaUrl = (
    items
) => {
    const json = {};
    items.forEach(item => {
        json[item.key] = item.value;
    });
    return encodeURIComponent(
        btoa(
            JSON.stringify(
                json
            )
        )
    );
}

/**
 * @param {{key: string, value: any}[]} items
 * @param {string} url 
 * @param {string} parameterName 
 * @returns {string}
 */
const addEncodedStorageItemsToEndOfUrl = (
    items,
    url,
    parameterName
) => {
    const encodedItems = encodeStorageItemsForTransferViaUrl(
        items
    );
    const urlObject = new URL(
        url
    );
    urlObject.searchParams.append(
        parameterName,
        encodedItems
    );
    return urlObject.href;
}
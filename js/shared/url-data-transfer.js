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

/**
 * @returns {string}
 */
const getCheckoutUrlWithCheckCoverageData = () => {
    const items = [
        {
            key: "check-coverage-data",
            value: {
                addressLineOne: Store.local.read(
                    Store.keys.checkoutFlow.shippingAddress_addressLine1
                ),
                addressLineTwo: Store.local.read(
                    Store.keys.checkoutFlow.shippingAddress_addressLine2
                ),
                city: Store.local.read(
                    Store.keys.checkoutFlow.shippingAddress_city
                ),
                stateCode: Store.local.read(
                    Store.keys.checkoutFlow.shippingAddress_state
                ),
                zip: Store.local.read(
                    Store.keys.checkoutFlow.shippingAddress_zip
                ),
                isBusinessCustomer: Store.local.read(
                    Store.keys.checkoutFlow.isBusinessCustomer
                )
            }
        }
    ];
    const url = addEncodedStorageItemsToEndOfUrl(
        items,
        "https://checkout.communityphone.org",
        URL_DATA_TRANSFER_PARAMETER_DEFAULT_NAME
    );
    return url;
}
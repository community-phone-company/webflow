Store.removeCheckoutData = function () {
    const checkoutStoreKeys = Object.keys(CheckoutFlowStoreKey).map(key => CheckoutFlowStoreKey[key]);
    const portPhoneNumberStoreKeys = Object.keys(PortPhoneNumberStoreKey).map(key => PortPhoneNumberStoreKey[key]);
    const allStoreKeys = checkoutStoreKeys.concat(portPhoneNumberStoreKeys);
    const store = Store.local;
    allStoreKeys.forEach(key => {
        store.write(
            key,
            undefined
        );
    });
};
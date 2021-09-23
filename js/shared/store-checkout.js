Store.removeCheckoutData = function () {
    const storeKeys = Object.keys(CheckoutFlowStoreKey).concat(
        Object.keys(PortPhoneNumberStoreKey)
    );
    const store = Store.local;
    storeKeys.forEach(key => {
        store.write(
            key,
            undefined
        );
    });
};
class CheckoutSessionDataReader {

    /**
     * @constructor
     * @param {any} data 
     */
    constructor(data) {
        this.data = data;
    }

    transferDataToStore() {
        if (!this.data) {
            return;
        }

        const store = Store.local;

        if (this.data.check_coverage) {
            store.write(
                Store.keys.checkoutFlow.isBusinessCustomer,
                this.data.check_coverage.landline_service === "business"
            );
            store.write(
                Store.keys.checkoutFlow.shippingAddress_addressLine1,
                this.data.check_coverage.address_line_one
            );
            store.write(
                Store.keys.checkoutFlow.shippingAddress_addressLine2,
                this.data.check_coverage.address_line_two
            );
            store.write(
                Store.keys.checkoutFlow.shippingAddress_city,
                this.data.check_coverage.city
            );
            store.write(
                Store.keys.checkoutFlow.shippingAddress_city,
                this.data.check_coverage.city
            );
            store.write(
                Store.keys.checkoutFlow.shippingAddress_zip,
                this.data.check_coverage.zip
            );
            store.write(
                Store.keys.checkoutFlow.shippingAddress_state,
                this.data.check_coverage.state_code
            );
        }

        if (this.data.products) {
            store.write(
                Store.keys.checkoutFlow.selectedPhoneNumber,
                this.data.products.selected_phonenumber
            );
            store.write(
                Store.keys.checkoutFlow.getNewNumber,
                this.data.products.phonenumber_service === "selected-number"
            );
            store.write(
                Store.keys.checkoutFlow.selectedProductIdentifiers,
                this.data.products.selected_products
            );
            store.write(
                Store.keys.portPhoneNumber.carrierName,
                this.data.products.porting_data.technical_data.carrier_name
            );
            store.write(
                Store.keys.portPhoneNumber.accountName,
                this.data.products.porting_data.technical_data.account_name
            );
            store.write(
                Store.keys.portPhoneNumber.numberToPort,
                this.data.products.porting_data.technical_data.number_to_port
            );
            store.write(
                Store.keys.portPhoneNumber.accountNumber,
                this.data.products.porting_data.technical_data.account_number
            );
            store.write(
                Store.keys.portPhoneNumber.pin,
                this.data.products.porting_data.technical_data.pin
            );
            store.write(
                Store.keys.portPhoneNumber.firstName,
                this.data.products.porting_data.service_address.first_name
            );
            store.write(
                Store.keys.portPhoneNumber.lastName,
                this.data.products.porting_data.service_address.last_name
            );
            store.write(
                Store.keys.portPhoneNumber.addressLineOne,
                this.data.products.porting_data.service_address.address_line_one
            );
            store.write(
                Store.keys.portPhoneNumber.city,
                this.data.products.porting_data.service_address.city
            );
            store.write(
                Store.keys.portPhoneNumber.state,
                this.data.products.porting_data.service_address.state
            );
            store.write(
                Store.keys.portPhoneNumber.zip,
                this.data.products.porting_data.service_address.zip
            );
        }

        if (this.data.account_details) {
        }

        if (this.data.billing_details) {
        }

        if (this.data.learn_more) {
        }
    }
}
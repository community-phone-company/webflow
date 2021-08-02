$(document).ready(() => {

    const form = document.getElementById("wf-form-porting-form");

    const accountNumberInput = document.getElementById("account-number");
    accountNumberInput.oninput = () => {
        formData.account_number = accountNumberInput.value;
        handleFormChange();
    };

    const pinInput = document.getElementById("Pin");
    pinInput.oninput = () => {
        formData.pin = pinInput.value;
        handleFormChange();
    };

    const nameInAccountInput = document.getElementById("Name-in-the-account");
    nameInAccountInput.oninput = () => {
        formData.name_in_account = nameInAccountInput.value;
        handleFormChange();
    };

    const numberToPortInput = document.getElementById("Number-you-want-to-port");
    numberToPortInput.oninput = () => {
        formData.number_to_port = numberToPortInput.value;
        handleFormChange();
    };

    const serviceAddressFirstNameInput = document.getElementById("First-name-2");
    serviceAddressFirstNameInput.oninput = () => {
        formData.service_address_first_name = serviceAddressFirstNameInput.value;
        handleFormChange();
    };

    const serviceAddressLastNameInput = document.getElementById("Last-Name");
    serviceAddressLastNameInput.oninput = () => {
        formData.service_address_last_name = serviceAddressLastNameInput.value;
        handleFormChange();
    };

    const serviceAddressLineOneInput = document.getElementById("Adress-line");
    serviceAddressLineOneInput.oninput = () => {
        formData.service_address_line_1 = serviceAddressLineOneInput.value;
        handleFormChange();
    };

    const serviceAddressLineTwoInput = document.getElementById("Adress-line-2");
    serviceAddressLineTwoInput.oninput = () => {
        formData.service_address_line_2 = serviceAddressLineTwoInput.value;
        handleFormChange();
    };

    const serviceAddressCityInput = document.getElementById("City-2");
    serviceAddressCityInput.oninput = () => {
        formData.service_address_city = serviceAddressCityInput.value;
        handleFormChange();
    };

    const serviceAddressZipInput = document.getElementById("Zip-2");
    serviceAddressZipInput.oninput = () => {
        formData.service_address_zip = serviceAddressZipInput.value;
        handleFormChange();
    };

    const serviceAddressStateInput = document.getElementById("State-2");
    serviceAddressStateInput.oninput = () => {
        formData.service_address_state = serviceAddressStateInput.value;
        handleFormChange();
    };

    const submitButton = document.getElementById("submit-button");
    $(submitButton).on("click", () => {
        logger.print(`Zendesk`);
        logger.print(formData);
        
        ZendeskIntegration.createTicketForNumberTransfer(
            formData
        );

        GoogleDocIntegration.addLineToOnboarding(
            formData.email,
            undefined,
            true,
            undefined,
            undefined,
            undefined,
            undefined
        );
    });

    const formData = {
        email: Store.local.read(Store.keys.onboardingFlow.email) ?? "",
        account_number: "",
        pin: "",
        name_in_account: "",
        number_to_port: "",
        service_address_first_name: "",
        service_address_last_name: "",
        service_address_line_1: "",
        service_address_line_2: "",
        service_address_city: "",
        service_address_zip: "",
        service_address_state: serviceAddressStateInput.value
    };

    const handleFormChange = () => {
        logger.print(`Form has changed`);
        const isFormFilledCorrectly = formData.account_number.length
            && formData.pin.length
            && formData.name_in_account.length
            && formData.service_address_first_name.length
            && formData.service_address_last_name.length
            && formData.service_address_line_1.length
            && formData.service_address_city.length
            && formData.service_address_zip.length
            && formData.service_address_state.length;
        UserInterface.setElementEnabled(
            submitButton,
            isFormFilledCorrectly
        );
    };

    handleFormChange();
});
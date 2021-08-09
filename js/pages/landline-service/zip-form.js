/**
 * Represents zip form available on pages:
 * https://community-phone-test.webflow.io
 * https://landline.communityphone.org
 * 
 * The class is made to simplify updating state of the form.
 * State is an object of {@link ZipFormState} type.
 * It can be simply assigned to the form by using {@link ZipForm.setState} method.
 */
class ZipForm {

    /**
     * Creates a new instance of {@link ZipForm}.
     * @constructor
     * @param {HTMLDivElement | string} formContainer Div element that contains zip form. Also, you can use string selector here.
     * @param {HTMLDivElement | string} normalMessageBlock Div element that contains normal message block. Also, you can use string selector here.
     */
    constructor(formContainer, normalMessageBlock) {
        /**
         * Initialize reference to the form container.
         * The `formContainer` can be an `HTMLDivElement` instance or a string,
         * so we have to check the type and handle it properly.
         */
        if (formContainer instanceof HTMLDivElement) {
            this._formContainer = formContainer;
        } else if (typeof formContainer === "string") {
            const formContainerDiv = document.querySelectorAll(formContainer)[0];
        
            if (!(formContainerDiv instanceof HTMLDivElement)) {
                throw new Error(`${formContainer} is not a div!`);
            }

            this._formContainer = formContainerDiv;
        } else {
            throw new Error(`Form container not found.`);
        }

        /**
         * Initialize reference to the normal message block.
         * The `normalMessageBlock` can be an `HTMLDivElement` instance or a string,
         * so we have to check the type and handle it properly.
         */
        if (normalMessageBlock instanceof HTMLDivElement) {
            this._normalMessageBlock = normalMessageBlock;
        } else if (typeof normalMessageBlock === "string") {
            const normalMessageBlockDiv = document.querySelectorAll(normalMessageBlock)[0];

            if (!(normalMessageBlockDiv instanceof HTMLDivElement)) {
                throw new Error(`${normalMessageBlock} is not a div!`);
            }

            this._normalMessageBlock = normalMessageBlockDiv;
        } else {
            throw new Error(`Normal message block not found.`);
        }
    }

    /**
     * State getter.
     * @returns {ZipFormState | undefined} An instance of {@link ZipFormState} type.
     */
    getState = () => {
        return this._state;
    }

    /**
     * State setter. Use it to change zip form's layout.
     * @param {ZipFormState} newState An instance of {@link ZipFormState}.
     */
    setState = (newState) => {
        this._state = newState;
        logger.print(`Updated zip form state to ${newState.mode}`);

        /**
         * UI will change according to data from `newState`.
         */
        switch (newState.mode) {
            case ZipFormStateMode.initial: {
                /**
                 * Initial mode.
                 * We don't handle `newState.response` here because we assume
                 * this mode is used before all requests.
                 */
                this.setSubmitButtonTitle(ZipFormSubmitButtonTitle.checkCoverage);
                this.setSubmitButtonEnabled(false);
                this.setMessage();
                break;
            }
            case ZipFormStateMode.loading: {
                /**
                 * Loading mode.
                 * Similar to the initial mode.
                 * No needs to handle `newState.response` here as well.
                 */
                this.setSubmitButtonTitle(ZipFormSubmitButtonTitle.pleaseWait);
                this.setSubmitButtonEnabled(false);
                this.setMessage();
                break;
            }
            case ZipFormStateMode.success: {
                /**
                 * Success mode.
                 * We assume `newState.response` is not `undefined`.
                 */
                this.setSubmitButtonTitle(ZipFormSubmitButtonTitle.startLandlineService);
                this.setSubmitButtonEnabled(true);
                this.setMessage(
                    new ZipFormMessage(
                        ZipFormMessageType.success,
                        newState.message
                    )
                );
                break;
            }
            case ZipFormStateMode.error: {
                /**
                 * Error mode.
                 * The value of `newState.response` may or may not be `undefined`,
                 * so we handle all possible values here.
                 */
                $(this.getSubmitButton()).attr("data-wait", ZipFormSubmitButtonTitle.startLandlineService);
                this.setSubmitButtonTitle(ZipFormSubmitButtonTitle.startLandlineService);
                this.setSubmitButtonEnabled(false);

                if (newState.response) {
                    this.setMessage(
                        new ZipFormMessage(
                            ZipFormMessageType.error,
                            newState.message
                        )
                    );
                } else {
                    this.setMessage();
                }
                break;
            }
            default: {
                /**
                 * All other mode values are handled in this block.
                 * Currently we throw an error here
                 * because we handle all existing ZipFormStateMode values
                 * in the other cases above.
                 */
                throw new Error(`Unknown ZipFormStateMode value: ${newState.mode}`);
            }
        }
    }

    /**
     * Form container.
     * @returns {HTMLDivElement} `HTMLDivElement` instance.
     */
    getFormContainer = () => {
        return this._formContainer;
    }

    /**
     * Form.
     * @returns {HTMLFormElement} `HTMLFormElement` instance.
     */
    getForm = () => {
        /**
         * Some kind of lazy load implementation.
         * Once we call this method, it will remember the element
         * so we won't need to search it again over the entire document.
         */
        if (this._form) {
            return this._form;
        }

        const selector = ".form";
        const form = this.getFormContainer().querySelectorAll(selector)[0];
        
        if (form instanceof HTMLFormElement) {
            this._form = form;
            return form;
        } else {
            throw new Error(`${selector} is not an HTMLFormElement.`);
        }
    }

    /**
     * Text field for zip code.
     * @returns {HTMLInputElement} `HTMLInputElement` instance.
     */
    getZipInput = () => {
        /**
         * Some kind of lazy load implementation.
         * Once we call this method, it will remember the element
         * so we won't need to search it again over the entire document.
         */
        if (this._zipInput) {
            return this._zipInput;
        }

        const selector = ".text-field.w-input";
        const input = this.getFormContainer().querySelectorAll(selector)[0];
        
        if (input instanceof HTMLInputElement) {
            this._zipInput = input;
            return input;
        } else {
            throw new Error(`${selector} is not an HTMLInputElement.`);
        }
    }

    /**
     * Submit button.
     * @returns {HTMLInputElement} `HTMLInputElement` instance.
     */
    getSubmitButton = () => {
        /**
         * Some kind of lazy load implementation.
         * Once we call this method, it will remember the element
         * so we won't need to search it again over the entire document.
         */
        if (this._submitButton) {
            return this._submitButton;
        }

        const selector = ".start-landline-btn";
        const button = this.getFormContainer().querySelectorAll(selector)[0];
        
        if (button instanceof HTMLInputElement) {
            this._submitButton = button;
            return button;
        } else {
            throw new Error(`${selector} is not an HTMLInputElement.`);
        }
    }

    /**
     * Updates title for submit button.
     * 
     * Usage example:
     * ```
     * form.setSubmitButtonTitle(
     *     ZipFormSubmitButtonTitle.startLandlineService
     * );
     * ```
     * 
     * @param {string} title New title for submit button. It's recommended to use values from {@link ZipFormSubmitButtonTitle} enumeration.
     */
    setSubmitButtonTitle = (title) => {
        $(this.getSubmitButton()).val(title);
    }

    /**
     * Updates submit button to make it enabled or disabled.
     * @param {boolean} enabled Defines whether submit button should be enabled.
     */
    setSubmitButtonEnabled = (enabled) => {
        const buttonSelector = $(this.getSubmitButton());

        if (enabled) {
            buttonSelector.addClass("primary-button");
            buttonSelector.removeClass("disabled");
            buttonSelector.prop("disabled", false);
        } else {
            buttonSelector.removeClass("primary-button");
            buttonSelector.addClass("disabled");
            buttonSelector.prop("disabled", true);
        }

        logger.print(`Set submit button ${enabled ? "enabled" : "disabled"}`);
    }

    /**
     * Message block.
     * @returns {HTMLDivElement} `HTMLDivElement` instance.
     */
    getNormalMessageBlock = () => {
        return this._normalMessageBlock;
    }

    /**
     * Success message block.
     * @returns {HTMLDivElement} `HTMLDivElement` instance.
     */
    getSuccessMessageBlock = () => {
        /**
         * Some kind of lazy load implementation.
         * Once we call this method, it will remember the element
         * so we won't need to search it again over the entire document.
         */
        if (this._successMessageBlock) {
            return this._successMessageBlock;
        }

        const selector = ".div-success-message";
        const block = this.getFormContainer().querySelectorAll(selector)[0];
        
        if (block instanceof HTMLDivElement) {
            this._successMessageBlock = block;
            return block;
        } else {
            throw new Error(`${selector} is not an HTMLDivElement.`);
        }
    }

    /**
     * Error message block.
     * @returns {HTMLDivElement} `HTMLDivElement` instance.
     */
    getErrorMessageBlock = () => {
        /**
         * Some kind of lazy load implementation.
         * Once we call this method, it will remember the element
         * so we won't need to search it again over the entire document.
         */
        if (this._errorMessageBlock) {
            return this._errorMessageBlock;
        }

        const selector = ".div-error-message";
        const block = this.getFormContainer().querySelectorAll(selector)[0];
        
        if (block instanceof HTMLDivElement) {
            this._errorMessageBlock = block;
            return block;
        } else {
            throw new Error(`${selector} is not an HTMLDivElement.`);
        }
    }

    /**
     * Shows or hides message below the form.
     * @param {ZipFormMessage | undefined} message Message to show below the form. If `undefined`, the current message will be hidden.
     */
    setMessage = (message) => {
        const messageBlocks = Object.freeze({
            normal: this.getNormalMessageBlock(),
            success: this.getSuccessMessageBlock(),
            error: this.getErrorMessageBlock()
        });
        const allMessageBlocks = [
            messageBlocks.normal,
            messageBlocks.success,
            messageBlocks.error
        ];
        
        /**
         * Here we hide all blocks.
         * If `message` is not `undefined`, one of the blocks will be displayed later.
         */
        allMessageBlocks.forEach(block => {
            $(block).hide();
        });

        /**
         * Now we check that `message` is not `undefined`.
         * If so, one of the blocks will be displayed with HTML content from `message`.
         */
        if (message) {
            switch (message.messageType) {
                case ZipFormMessageType.normal: {
                    $(messageBlocks.normal).html(message.html);
                    $(messageBlocks.normal).show();
                    break;
                }
                case ZipFormMessageType.success: {
                    $(messageBlocks.success).find(".success_message").html(message.html);
                    $(messageBlocks.success).show();
                    break;
                }
                case ZipFormMessageType.error: {
                    $(messageBlocks.error).find(".success_message").html(message.html);
                    $(messageBlocks.error).show();
                    break;
                }
            }
        }
    }

    /**
     * Submits the form.
     */
    submit = () => {
        $(this.getForm()).submit();
    }
}

/**
 * Enumeration of zip form state modes.
 */
const ZipFormStateMode = Object.freeze({
    initial: "initial",
    loading: "loading",
    success: "success",
    error: "error"
});

/**
 * Represents state of zip form.
 * State includes some data that defines
 * appearance and behavior of the form.
 */
class ZipFormState {

    /**
     * Creates a new instance of `ZipFormState` type.
     * @constructor
     * @param {string} mode Use {@link ZipFormStateMode} values to set the mode.
     * @param {string | undefined} message String containing message HTML to display. Also, can be `undefined`.
     * @param {any | undefined} response Response that comes from the server. See {@link checkZip} for more information.
     */
    constructor(mode, message, response) {
        this.mode = mode;
        this.message = message;
        this.response = response;
    }

    /**
     * Additional constructor that does not require `response` parameter. Syntactic sugar added for purpose of convenience.
     * @param {string} mode Use {@link ZipFormStateMode} values to set the mode.
     * @returns {ZipFormState} New {@link ZipFormState} instance with specified mode.
     */
    static withMode = (mode) => {
        return new ZipFormState(
            mode,
            undefined,
            undefined
        );
    }
}

/**
 * Represents message that is shown below the form.
 */
class ZipFormMessage {

    /**
     * @constructor Creates new instance of `ZipFormMessage` type.
     * @param {ZipFormMessageType} messageType Type of the message. Use one of {@link ZipFormMessageType}'s values.
     * @param {string} html String containing HTML structure with message content.
     */
    constructor(messageType, html) {
        this.messageType = messageType;
        this.html = html;
    }
}

/**
 * Enumeration of zip form message types.
 */
const ZipFormMessageType = Object.freeze({
    normal: "normal",
    success: "success",
    error: "error"
});

/**
 * Enumeration of submit button titles.
 */
const ZipFormSubmitButtonTitle = Object.freeze({
    checkCoverage: "Check coverage",
    startLandlineService: "Start my landline service",
    pleaseWait: "Please wait..."
});
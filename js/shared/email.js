class EmailValidator {

    /**
     * Verifies whether email address is correct.
     * @param {string} email Email.
     * @returns {boolean}
     */
    check = (email) => {
        const emailRegularExpression = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return emailRegularExpression.test(email);
    }
}
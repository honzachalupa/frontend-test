import axios from 'axios';

const formValidation = (form) => {
    const messagesElement = form.querySelectorAll('.rules-info .message');
    const knownRules = ['min-length', 'max-length', 'required', 'pattern'];
    const messages = [];
    const submitButton = form.querySelector('.submit-button');
    let inputElements = form.querySelectorAll('input:not([type="radio"])'); // To-do: Add .form-check

    Array.from(inputElements).forEach((element) => {
        element.classList.add('validating');
        element.parentElement.innerHTML = `${element.parentElement.innerHTML}<div class="errors"></div>`;
    });

    inputElements = form.querySelectorAll('.validating');

    Array.from(inputElements).forEach((element) => {
        element.addEventListener('keyup', (e) => {
            validateInput(e.target);
        });

        if (element.type === 'date') {
            element.addEventListener('change', (e) => {
                validateInput(e.target);
            });
        }
    });

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        submitForm();
    });

    Array.from(messagesElement).forEach((element) => {
        const name = element.dataset.ruleName;
        const message = element.innerHTML;

        messages.push({
            name,
            message
        });
    });

    function validateAll() {
        Array.from(inputElements).forEach((element) => {
            validateInput(element);
        });
    }

    function validateInput(element) {
        const rules = parseRules(element.dataset.rules);
        const value = element.value;
        const errors = [];

        Array.from(rules).forEach((rule) => {
            let missingRule = true;

            if (rule.name === 'format') {
                const pattern = rule.value.substring(1, rule.value.length - 1);

                if (!new RegExp(pattern).test(value)) {
                    errors.push({
                        name: rule.name,
                        required: null,
                        current: null
                    });
                }

                missingRule = false;
            }

            if (rule.name === 'min-length') {
                if (value.length < rule.value) {
                    errors.push({
                        name: rule.name,
                        required: rule.value,
                        current: value.length
                    });
                }

                missingRule = false;
            }

            if (rule.name === 'max-length') {
                if (value.length > rule.value) {
                    errors.push({
                        name: rule.name,
                        required: rule.value,
                        current: value.length
                    });
                }

                missingRule = false;
            }

            if (rule.name === 'required') {
                if (value.length === 0) {
                    errors.push({
                        name: rule.name,
                        required: null,
                        current: null
                    });
                }

                missingRule = false;
            }

            if (missingRule) {
                throw new Error(`Unknown rule name: '${rule.name}'. List of known rules: ${knownRules.join(', ')}`);
            }
        });

        let html = '';
        Array.from(errors).forEach((error) => {
            Array.from(messages).forEach((message) => {
                if (error.name === message.name) {
                    html += `<div class="error">${fillErrorPlaceholders(error, message.message)}</div>`;
                }
            });
        });

        element.parentElement.querySelector('.errors').innerHTML = html;
        submitButton.disabled = !isValid();
    }

    function fillErrorPlaceholders(error, message) {
        return message.replace('@{current}', error.current).replace('@{required}', error.required);
    }

    function isValid() {
        return form.querySelectorAll('.errors .error').length === 0;
    }

    function parseRules(dataRules) {
        if (dataRules) {
            const rules = [];
            dataRules = dataRules.split(',');

            Array.from(dataRules).forEach((dataRule) => {
                dataRule = dataRule.split('=');
                const name = dataRule[0].trim();

                if (dataRule.length === 2) {
                    const value = dataRule[1].trim();

                    rules.push({
                        name,
                        value: setDatatype(value)
                    });
                } else if (dataRule.length === 1) {
                    rules.push({
                        name,
                        value: true
                    });
                } else {
                    throw new Error(`Rules are in wrong format: ${dataRule}`);
                }
            });

            return rules;
        }

        return null;
    }

    function setDatatype(value) { // To-do !!!
        if (typeof (value) === 'number') {
            return Number(value);
        } else if (typeof (value) === 'boolean') {
            return Boolean(value);
        }

        return value;
    }

    function submitForm() {
        const data = getFormData();

        axios('', {
            method: 'POST',
            params: data
        })
        .then((response) => {
            alert('Data posted.');
        })
        .catch((error) => {
            throw new Error(error);
        });
    }

    function getFormData() {
        const data = {};

        Array.from(inputElements).forEach((element) => {
            const key = makeCamelCase(element.id);
            const value = element.value;

            data[key] = value;
        });

        return data;
    }

    function makeCamelCase(value) {
        value = value.toLowerCase();
        value = value.replace(/[-_]/g, ' ');
        value = value.split(/\s/g);

        let camel = value[0];

        for (let i = 1; i < value.length; i += 1) {
            camel += capitalize(value[i]);
        }

        return camel;
    }

    function capitalize(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
};

export default formValidation;

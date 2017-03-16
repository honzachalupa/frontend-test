const formValidation = (form) => {
    const messagesElement = form.querySelectorAll('.rules-info .message');
    let inputElements = form.querySelectorAll('input:not([type="radio"])'); // To-do: Add .form-check
    const knownRules = ['min-length', 'max-length', 'required', 'pattern'];
    const messages = [];

    Array.from(inputElements).forEach((element) => {
        element.classList.add('validating');
        element.parentElement.innerHTML = `${element.parentElement.innerHTML}<div class="errors"></div>`;
    });

    inputElements = form.querySelectorAll('.validating');

    Array.from(inputElements).forEach((element) => {
        const rules = parseRules(element.dataset.rules);

        element.addEventListener('keyup', (e) => {
            validate(e.target, rules);
        });
    });

    Array.from(messagesElement).forEach((element) => {
        const name = element.dataset.ruleName;
        const message = element.innerHTML;

        messages.push({
            name: name,
            message: message
        });
    });

    function validate(element = null, rules = null) {
        if (element && rules) {
            const value = element.value;
            const errors = [];

            Array.from(rules).forEach((rule) => {
                const patt1 = /^\/.*\/[a-z]{0,3}$/gim;
                let missingRule = true;

                if (rule.name === 'format') {
                    const pattern = rule.value.substring(1, rule.value.length - 1);

                    if (!new RegExp(pattern).test(value)) {
                        errors.push({
                            name: rule.name,
                            required: 'wrong format',
                            current: 'right format'
                        });

                        missingRule = false;
                    }
                }

                if (rule.name === 'min-length' && value.length < rule.value) {
                    errors.push({
                        name: rule.name,
                        required: rule.value,
                        current: value.length
                    });

                    missingRule = false;
                }

                if (rule.name === 'max-length' && value.length > rule.value) {
                    errors.push({
                        name: rule.name,
                        required: rule.value,
                        current: value.length
                    });

                    missingRule = false;
                }

                if (rule.name === 'required' && value.length === 0) {
                    errors.push({
                        name: rule.name,
                        required: 'filled',
                        current: 'empty'
                    });

                    missingRule = false;
                }

                if (missingRule) {
                    throw new Error(`Unknown rule name: ${rule.name}`);
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
        }
    }

    function fillErrorPlaceholders(error, message) {
        return message.replace('@{current}', error.current).replace('@{required}', error.required);
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
                        name: name,
                        value: setDatatype(value)
                    });
                } else if (dataRule.length === 1) {
                    rules.push({
                        name: name,
                        value: true
                    });
                } else {
                    throw new Error(`Rules are in wrong format: ${dataRule}`);
                }
            });

            return checkUnknownRules(rules);
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

    function checkUnknownRules(rules) {
        /* const filteredRules = {};

        Array.from(Object.keys(rules)).forEach((key) => {
            if (knownRules.indexOf(key) > -1) {
                filteredRules[key] = rules[key];
            }
        });

        return filteredRules; */

        return rules;
    }

    /* function makeCamelCase(value) {
        value = value.toLowerCase();
        value = value.replace(/[-_]/g, ' ');
        value = value.split(/\s/g);

        let camel = value[0];

        for (let i = 1; i < value.length; i++) {
            camel += capitalize(value[i]);
        }

        return camel;
    }

    function capitalize(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    } */
};

export default formValidation;

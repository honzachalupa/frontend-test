import 'babel-polyfill';
import 'svgxuse';
import init from './init';
import factory from './factory';
import footer from './components/footer';
import formValidation from './utilities/form-validation';

const app = (config) => {
    init(footer, document.querySelector('.footer'));
    factory(formValidation, document.querySelectorAll('form[data-validate="true"]'));
};

app(window.config);

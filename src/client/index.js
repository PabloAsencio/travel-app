import { handleSubmit } from './js/app';
import { autocomplete } from './js/autocomplete';
import { setDateFields } from './js/date';

import './styles/style.scss';
import './styles/form.scss';

// Set functionality and event listener for the dropdown list
autocomplete(document.getElementById('city'));

// Set initial values and event listener for the date input elements
const startDateField = document.getElementById('start');
const endDateField = document.getElementById('end');
setDateFields(startDateField, endDateField);

// Event listener for form submission
const form = document.getElementById('tripInfo');
const submitButton = document.getElementById('submit');
form.addEventListener('submit', handleSubmit);
submitButton.addEventListener('submit', handleSubmit);
submitButton.addEventListener('click', handleSubmit);

export { handleSubmit, autocomplete, setDateFields };

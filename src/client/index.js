import { updateLastEntry } from './js/app';
import { autocomplete } from './js/autocomplete';
import { setDateFields } from './js/date';

import './styles/style.scss';
import './styles/form.scss';

// Set event listeners
autocomplete(document.getElementById('city'));
const startDateField = document.getElementById('start');
const endDateField = document.getElementById('end');

setDateFields(startDateField, endDateField);

export { updateLastEntry, autocomplete, setDateFields };

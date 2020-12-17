import { updateLastEntry } from './js/app';
import { autocomplete } from './js/autocomplete';

import './styles/style.scss';
import './styles/form.scss';

// Set event listeners
document.getElementById('generate').addEventListener('click', updateLastEntry);
autocomplete(document.getElementById('city'));

export { updateLastEntry, autocomplete };

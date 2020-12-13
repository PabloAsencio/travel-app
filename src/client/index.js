import { updateLastEntry } from './js/app';

import './styles/style.scss';

// Set event listeners
document.getElementById('generate').addEventListener('click', updateLastEntry);

export { updateLastEntry };

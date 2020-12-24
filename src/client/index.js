import { startApplication, handleSubmit } from './js/app';
import { applicationState } from './js/appState';

import './styles/style.scss';
import './styles/form.scss';

startApplication(applicationState);

// Event listener for form submission
const form = document.getElementById('tripInfo');
const submitButton = document.getElementById('submit');
form.addEventListener('submit', handleSubmit);
submitButton.addEventListener('submit', handleSubmit);
submitButton.addEventListener('click', handleSubmit);

export { handleSubmit };

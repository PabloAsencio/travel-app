import { app } from './js/app';
import { applicationState } from './js/appState';
import { createAPIService } from './js/apiService';
import { createDateController } from './js/dateController';
import { createViewUpdater } from './js/uiUpdater';
import { cityDropdownListController } from './js/autocomplete';

import './styles/style.scss';
import './styles/form.scss';

// Set up components
const apiService = createAPIService();
const viewUpdater = createViewUpdater(applicationState);
const dateController = createDateController(applicationState, viewUpdater);
// Configure dependencies for the dropdown list
cityDropdownListController.apiService = apiService;
cityDropdownListController.appState = applicationState;
cityDropdownListController.viewUpdater = viewUpdater;

// Configure dependencies and start application
app.apiService = apiService;
app.applicationState = applicationState;
app.cityController = cityDropdownListController;
app.dateController = dateController;
app.viewUpdater = viewUpdater;
app.start();

// Event listener for form submission
// Logically this should actually be setup inside the app.start method called above
// It is here to satisfy the requirement that at least one event listener
// must be added in index.js
const form = document.getElementById('tripInfo');
const submitButton = document.getElementById('submit');
form.addEventListener('submit', app.handleSubmit);
submitButton.addEventListener('submit', app.handleSubmit);
submitButton.addEventListener('click', app.handleSubmit);

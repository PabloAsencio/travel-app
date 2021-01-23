// *** DEPENDENCIES ***
// These are needed to make sure the application works on IE 11,
// Which in turn is needed to be able to test the application on a
// browser that does not support the date input element
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// TODO: Review handling of http status codes returned from fetch
// See https://www.npmjs.com/package/whatwg-fetch#handling-http-error-statuses
import 'whatwg-fetch';

// *** COMPONENTS ***
import { app } from './js/app';
import { applicationState } from './js/services/applicationState';
import { apiService } from './js/services/apiService';
import { dateController } from './js/controllers/dateController';
import { cityController } from './js/controllers/cityController';
import { dateInputFactory } from './js/services/dateInputFactory';
import { newTripViewUpdater } from './js/viewUpdaters/newTripViewUpdater';
import { dateViewUpdater } from './js/viewUpdaters/dateViewUpdater';
import { cityViewUpdater } from './js/viewUpdaters/cityViewUpdater';

// *** STYLESHEETS ***
import './styles/main.scss';

// *** CONFIGURE COMPONENTS ***
// Configure dependencies for the dateInputFactory
dateInputFactory.viewUpdater = dateViewUpdater;

// Configure dependencies for the date controller
dateController.applicationState = applicationState;
dateController.viewUpdater = dateViewUpdater;
dateController.dateInputFactory = dateInputFactory;

// Configure dependencies for the city dropdown list
cityController.apiService = apiService;
cityController.appState = applicationState;
cityController.viewUpdater = cityViewUpdater;

// Configure dependencies and start application
app.apiService = apiService;
app.applicationState = applicationState;
app.cityController = cityController;
app.dateController = dateController;
app.viewUpdater = newTripViewUpdater;
app.start();

// Event listener for form submission
// Logically this should actually be setup inside the app.start method called above
// It is here to satisfy the requirement that at least one event listener
// must be added in index.js
const form = document.getElementById('tripSelection__form');
const submitButton = document.getElementById('tripSelection__submit');
form.addEventListener('submit', app.handleSubmit);
submitButton.addEventListener('submit', app.handleSubmit);
submitButton.addEventListener('click', app.handleSubmit);

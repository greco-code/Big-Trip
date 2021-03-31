import {createSiteMenuTemplate} from './createSiteMenuTemplate';
import {createTripInfoTemplate} from './createTripInfoTemplate';
import {createTripFilterTemplate} from './createTripFilterTemplate';
import {createTripSortTemplate} from './createTripSortTemplate';
import {createTripEventsListTemplate} from './createTripEventsListTemplate';
import {createAddNewPointFormTemplate} from './createAddNewPointFormTemplate';
import {createEventTemplate} from './createEventTemplate';
import {createEditPointForm} from './createEditPointForm';

const headerMain = document.querySelector('.trip-main');
const pageMain = document.querySelector('.page-main');
const headerMenuContainer = headerMain.querySelector('.trip-controls__navigation');
const tripFilterContainer = headerMain.querySelector('.trip-controls__filters');
const tripEventsContainer = pageMain.querySelector('.trip-events');


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(headerMenuContainer, createSiteMenuTemplate(), 'beforeend');
render(headerMain, createTripInfoTemplate(), 'afterbegin');
render(tripFilterContainer, createTripFilterTemplate(), 'afterbegin');
render(tripEventsContainer, createTripSortTemplate(), 'afterbegin');
render(tripEventsContainer, createTripEventsListTemplate(), 'beforeend');

// todo получается некрасиво, как можно решить?
const tripEventsList = document.querySelector('.trip-events__list');

for (let i = 1; i < 3; i++) {
  render(tripEventsList, createEventTemplate(), 'afterbegin');
}

render(tripEventsList, createEditPointForm(), 'afterbegin');
render(tripEventsList, createAddNewPointFormTemplate(), 'afterbegin');

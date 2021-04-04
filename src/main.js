import {createSiteMenuTemplate} from './view/site-menu';
import {createTripInfoTemplate} from './view/trip-info';
import {createTripFilterTemplate} from './view/trip-filter';
import {createTripSortTemplate} from './view/trip-sort';
import {createTripEventsListTemplate} from './view/event-list-container';
import {createEventTemplate} from './view/event';
import {createPointForm} from './view/point-form';
import {generateEvent} from './mock/event-data';
import {createEventPhotosContainer} from './view/event-photos';

const headerMain = document.querySelector('.trip-main');
const pageMain = document.querySelector('.page-main');
const headerMenuContainer = headerMain.querySelector('.trip-controls__navigation');
const tripFilterContainer = headerMain.querySelector('.trip-controls__filters');
const tripEventsContainer = pageMain.querySelector('.trip-events');

const EVENTS_COUNT = 3;


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(headerMenuContainer, createSiteMenuTemplate(), 'beforeend');
render(headerMain, createTripInfoTemplate(), 'afterbegin');
render(tripFilterContainer, createTripFilterTemplate(), 'afterbegin');
render(tripEventsContainer, createTripSortTemplate(), 'afterbegin');
render(tripEventsContainer, createTripEventsListTemplate(), 'beforeend');

const tripEventsList = document.querySelector('.trip-events__list');

for (let i = 1; i < EVENTS_COUNT; i++) {
  render(tripEventsList, createEventTemplate(), 'afterbegin');
}

render(tripEventsList, createPointForm(), 'afterbegin');
render(tripEventsList, createPointForm(), 'afterbegin');

const photosContainer = document.querySelector('.event__section--destination');
render(photosContainer, createEventPhotosContainer(), 'beforeend');


const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

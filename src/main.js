import {createSiteMenuTemplate} from './createSiteMenuTemplate';
import {createTripInfoTemplate} from './createTripInfoTemplate';
import {createTripFilterTemplate} from './createTripFilterTemplate';
import {createTripSortTemplate} from './createTripSortTemplate';
import {createTripEventsListTemplate} from './createTripEventsListTemplate';
import {createTripEventsItemTemplate} from './createTripEventsItemTemplate';
import {createAddNewPointFormTemplate} from './createAddNewPointFormTemplate';

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
render(tripEventsContainer, createTripEventsListTemplate(), 'afterbegin');

//todo получается некрасиво, как можно решить?
const tripEventsList = document.querySelector('.trip-events__list');

render(tripEventsList, createTripEventsItemTemplate(), 'afterbegin');

const tripEventsItem = tripEventsList.querySelector('.trip-events__item');

render(tripEventsItem, createAddNewPointFormTemplate(), 'afterbegin');

import SiteMenuView from './view/site-menu';
import {createTripInfoTemplate} from './view/trip-info';
import {createTripFilterTemplate} from './view/trip-filter';
import {createTripSortTemplate} from './view/trip-sort';
import {createTripEventsListTemplate} from './view/event-list-container';
import {createEventTemplate} from './view/event';
import {createPointForm} from './view/event-form';
import {generateEvent} from './mock/event-data';
import {createEventItemContainerTemplate} from './view/event-item-container';
import {renderTemplate, renderElement, RenderPosition} from './util';
import dayjs from 'dayjs';


const headerMain = document.querySelector('.trip-main');
const pageMain = document.querySelector('.page-main');
const headerMenuContainer = headerMain.querySelector('.trip-controls__navigation');
const tripFilterContainer = headerMain.querySelector('.trip-controls__filters');
const tripEventsContainer = pageMain.querySelector('.trip-events');

const EVENTS_COUNT = 15;

const events = new Array(EVENTS_COUNT)
  .fill()
  .map(generateEvent)
  .sort((a, b) => dayjs(a.date_from) - dayjs(b.date_from));

renderElement(headerMenuContainer, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderTemplate(headerMain, createTripInfoTemplate(events), 'afterbegin');
renderTemplate(tripFilterContainer, createTripFilterTemplate(), 'afterbegin');
renderTemplate(tripEventsContainer, createTripSortTemplate(), 'afterbegin');
renderTemplate(tripEventsContainer, createTripEventsListTemplate(), 'beforeend');

const tripEventsList = document.querySelector('.trip-events__list');

for (let i = 0; i < EVENTS_COUNT; i++) {
  renderTemplate(tripEventsList, createEventItemContainerTemplate(), 'afterbegin');
}

const tripEventItems = document.querySelectorAll('.trip-events__item');

renderTemplate(tripEventItems[0], createPointForm(events[0]), 'afterbegin');
renderTemplate(tripEventItems[1], createPointForm(events[1]), 'afterbegin');

for (let i = 2; i < EVENTS_COUNT; i++) {
  const tripEventItem = tripEventItems[i];
  renderTemplate(tripEventItem, createEventTemplate(events[i]), 'afterbegin');
}

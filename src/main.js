import SiteMenuView from './view/site-menu.js';
// import SiteSortView from './view/trip-sort.js';
// import {createTripInfoTemplate} from './view/trip-info.js';
// import {createTripFilterTemplate} from './view/trip-filter.js';
// import {createTripSortTemplate} from './view/trip-sort';
// import {createTripEventsListTemplate} from './view/event-list-container.js';
// import {createEventTemplate} from './view/event.js';
// import {createPointForm} from './view/event-form.js';
// import {generateEvent} from './mock/event-data.js';
// import {createEventItemContainerTemplate} from './view/event-item-container.js';
import {renderTemplate, renderElement, RenderPosition} from './util.js';
// import dayjs from 'dayjs';


const headerMain = document.querySelector('.trip-main');
// const pageMain = document.querySelector('.page-main');
const headerMenuContainer = headerMain.querySelector('.trip-controls__navigation');
// const tripFilterContainer = headerMain.querySelector('.trip-controls__filters');
// const tripEventsContainer = pageMain.querySelector('.trip-events');

// const EVENTS_COUNT = 15;

// const events = new Array(EVENTS_COUNT)
//   .fill()
//   .map(generateEvent)
//   .sort((a, b) => dayjs(a.date_from) - dayjs(b.date_from));

// const hi = new SiteMenuView().getElement();
// headerMenuContainer.insertAdjacentHTML('beforeend', new SiteMenuView().getElement());
renderElement(headerMenuContainer, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
// renderTemplate(headerMain, createTripInfoTemplate(events), 'afterbegin');
// renderTemplate(tripFilterContainer, createTripFilterTemplate(), 'afterbegin');
// renderTemplate(tripEventsContainer, createTripSortTemplate(), 'afterbegin');
// renderElement(tripEventsContainer, new SiteSortView().getElement(), RenderPosition.AFTERBEGIN);
// renderTemplate(tripEventsContainer, createTripEventsListTemplate(), 'beforeend');
//
// const tripEventsList = document.querySelector('.trip-events__list');
//
// for (let i = 0; i < EVENTS_COUNT; i++) {
//   renderTemplate(tripEventsList, createEventItemContainerTemplate(), 'afterbegin');
// }
//
// const tripEventItems = document.querySelectorAll('.trip-events__item');
//
// renderTemplate(tripEventItems[0], createPointForm(events[0]), 'afterbegin');
// renderTemplate(tripEventItems[1], createPointForm(events[1]), 'afterbegin');
//
// for (let i = 2; i < EVENTS_COUNT; i++) {
//   const tripEventItem = tripEventItems[i];
//   renderTemplate(tripEventItem, createEventTemplate(events[i]), 'afterbegin');
// }

import MenuView from './view/menu.js';
import SortView from './view/trip-sort.js';
import FilterView from './view/trip-filter.js';
import EventListItemView from './view/event-item-container.js';
import EventListView from './view/event-list-container.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createEventTemplate} from './view/event.js';
import {createPointForm} from './view/event-form.js';
import {generateEvent} from './mock/event-data.js';
import {renderTemplate, renderElement, RenderPosition} from './util.js';
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

renderElement(headerMenuContainer, new MenuView().getElement(), RenderPosition.BEFOREEND);
renderTemplate(headerMain, createTripInfoTemplate(events), 'afterbegin');
renderElement(tripFilterContainer, new FilterView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(tripEventsContainer, new SortView().getElement(), RenderPosition.AFTERBEGIN);

const tripEventList = new EventListView();
renderElement(tripEventsContainer, tripEventList.getElement(), RenderPosition.BEFOREEND);


for (let i = 0; i < EVENTS_COUNT; i++) {
  renderElement(tripEventList.getElement(), new EventListItemView().getElement(), RenderPosition.AFTERBEGIN);
}

const tripEventItems = document.querySelectorAll('.trip-events__item');

renderTemplate(tripEventItems[0], createPointForm(events[0]), 'afterbegin');
renderTemplate(tripEventItems[1], createPointForm(events[1]), 'afterbegin');

for (let i = 2; i < EVENTS_COUNT; i++) {
  const tripEventItem = tripEventItems[i];
  renderTemplate(tripEventItem, createEventTemplate(events[i]), 'afterbegin');
}

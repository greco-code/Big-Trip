import MenuView from './view/menu.js';
import SortView from './view/trip-sort.js';
import FilterView from './view/trip-filter.js';
import EventListItemView from './view/event-item-container.js';
import EventListView from './view/event-list-container.js';
import EventView from './view/event.js';
import TripInfoView from './view/trip-info.js';
import EventFormView from './view/event-form.js';
import {generateEvent} from './mock/event-data.js';
import {render, RenderPosition} from './util.js';
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

const renderEvent = (tripEventItem, event) => {
  const taskComponent = new EventView(event);
  const eventForm = new EventFormView(event);

  render(tripEventItem, taskComponent.getElement(), RenderPosition.AFTERBEGIN);
};

render(headerMenuContainer, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(headerMain, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);
render(tripFilterContainer, new FilterView().getElement(), RenderPosition.AFTERBEGIN);
render(tripEventsContainer, new SortView().getElement(), RenderPosition.AFTERBEGIN);

const tripEventList = new EventListView();
render(tripEventsContainer, tripEventList.getElement(), RenderPosition.BEFOREEND);


for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripEventList.getElement(), new EventListItemView().getElement(), RenderPosition.AFTERBEGIN);
}

const tripEventItems = tripEventList.getElement().querySelectorAll('.trip-events__item');

for (let i = 0; i < EVENTS_COUNT; i++) {
  const tripEventItem = tripEventItems[i];
  renderEvent(tripEventItem, events[i]);
}

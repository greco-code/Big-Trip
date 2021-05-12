import MenuView from './view/menu.js';
import TripInfoView from './view/trip-info.js';
import {generateEvent} from './mock/event-data.js';
import {render} from './utils/render.js';
import dayjs from 'dayjs';
import RoutePresenter from './presenter/route.js';
import EventsModel from './model/events.js';
import {RenderPosition} from './const.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filters.js';
import NewEventButtonView from './view/new-button.js';

const headerMain = document.querySelector('.trip-main');
const pageMain = document.querySelector('.page-main');
const headerMenuContainer = headerMain.querySelector('.trip-controls__navigation');
const tripFilterContainer = headerMain.querySelector('.trip-controls__filters');
const pageContainer = pageMain.querySelector('.trip-events');

const newEventButton = new NewEventButtonView();

const EVENTS_COUNT = 15;

const events = new Array(EVENTS_COUNT)
  .fill()
  .map(generateEvent)
  .sort((a, b) => dayjs(a.date_from) - dayjs(b.date_from));


if (events.length) {
  render(headerMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);
}

render(headerMenuContainer, new MenuView(), RenderPosition.BEFOREEND);
render(headerMain, newEventButton, RenderPosition.BEFOREEND);


const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const routePresenter = new RoutePresenter(pageContainer, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(tripFilterContainer, filterModel, eventsModel);

newEventButton.setNewEventClickHandler(() => {
  routePresenter.createEvent();
  routePresenter.handleNewEventFormOpen();
});

filterPresenter.init();
routePresenter.init();

/* todo
* 1. Создаются заново точки при клике на сортировку
* 2. Заменить delete на cancel
* 3. Хедер не работает
* 4. Заменить blank-task
* 5. Не сохраняются чекнутые офферы
* */

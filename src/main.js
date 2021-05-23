import MenuView from './view/menu.js';
import TripInfoView from './view/trip-info.js';
import {generateEvent} from './mock/event-data.js';
import {remove, render} from './utils/render.js';
import dayjs from 'dayjs';
import RoutePresenter from './presenter/route.js';
import EventsModel from './model/events.js';
import {FilterType, MenuItem, RenderPosition, UpdateType} from './const.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filters.js';
import NewEventButtonView from './view/new-button.js';
import {offers} from './mock/offers-data.js';
import {destinations} from './mock/destinations-data.js';
import StatisticsView from './view/statistics.js';

const headerMain = document.querySelector('.trip-main');
const pageMain = document.querySelector('.page-main');
const pageContainer = pageMain.querySelector('.page-body__container');
const headerMenuContainer = headerMain.querySelector('.trip-controls__navigation');
const tripFilterContainer = headerMain.querySelector('.trip-controls__filters');
const eventsContainer = pageMain.querySelector('.trip-events');

const newEventButton = new NewEventButtonView();
const siteMenuComponent = new MenuView();
let statisticsComponent = null;

const EVENTS_COUNT = 15;

const events = new Array(EVENTS_COUNT)
  .fill()
  .map(generateEvent)
  .sort((a, b) => dayjs(a.date_from) - dayjs(b.date_from));

if (events.length) {
  render(headerMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);
}

render(headerMenuContainer, siteMenuComponent, RenderPosition.BEFOREEND);
render(headerMain, newEventButton, RenderPosition.BEFOREEND);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      routePresenter.init();
      break;
    case MenuItem.STATS:
      routePresenter.destroy();
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(pageContainer, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);


const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const routePresenter = new RoutePresenter(eventsContainer, eventsModel, filterModel, offers, destinations);
const filterPresenter = new FilterPresenter(tripFilterContainer, filterModel, eventsModel);

newEventButton.setNewEventClickHandler(() => {
  if (statisticsComponent) {
    remove(statisticsComponent);
    siteMenuComponent.setMenuItem(MenuItem.TABLE);
    filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    routePresenter.init();
  }

  routePresenter.createEvent();
  routePresenter.handleNewEventFormOpen();
});

filterPresenter.init();
routePresenter.init();


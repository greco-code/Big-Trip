import MenuView from './view/menu.js';
import TripInfoView from './view/trip-info.js';
import {remove, render} from './utils/render.js';
import dayjs from 'dayjs';
import RoutePresenter from './presenter/route.js';
import EventsModel from './model/events.js';
import {FilterType, MenuItem, RenderPosition, UpdateType} from './const.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filters.js';
import NewEventButtonView from './view/new-button.js';
import StatisticsView from './view/statistics.js';
import Api from './api.js';
import DataModel from './model/data.js';

const AUTHORIZATION = 'Basic cjr1J69xYe0lMur';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const headerMain = document.querySelector('.trip-main');
const pageMain = document.querySelector('.page-main');
const pageContainer = pageMain.querySelector('.page-body__container');
const headerMenuContainer = headerMain.querySelector('.trip-controls__navigation');
const tripFilterContainer = headerMain.querySelector('.trip-controls__filters');
const eventsContainer = pageMain.querySelector('.trip-events');

const newEventButton = new NewEventButtonView();
const siteMenuComponent = new MenuView();
let statisticsComponent = null;

const api = new Api(END_POINT, AUTHORIZATION);

// if (events.length) {
//   render(headerMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);
// }

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
const dataModel = new DataModel();
const filterModel = new FilterModel();

const routePresenter = new RoutePresenter(eventsContainer, eventsModel, filterModel, dataModel, api);
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


api.getOffers()
  .then((offers) => {
    dataModel.setOffers(UpdateType.INIT, offers);
    render(headerMenuContainer, siteMenuComponent, RenderPosition.BEFOREEND);
    render(headerMain, newEventButton, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    dataModel.setOffers(UpdateType.INIT, []);
  })
  .then(() => api.getEvents())
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
  })
  .then(() => api.getDestinations())
  .then((destinations) => {
    dataModel.setDestinations(UpdateType.INIT, destinations);
  })
  .catch(() => {
    dataModel.setDestinations(UpdateType.INIT, []);
  });



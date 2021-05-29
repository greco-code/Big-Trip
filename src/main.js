import MenuView from './view/menu.js';
import {remove, render} from './utils/render.js';
import RoutePresenter from './presenter/route.js';
import EventsModel from './model/events.js';
import {FilterType, MenuItem, RenderPosition, UpdateType} from './const.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filters.js';
import NewEventButtonView from './view/new-event-button.js';
import StatisticsView from './view/statistics.js';
import Api from './api.js';
import DataModel from './model/data.js';

const AUTHORIZATION = 'Basic cjr1J69xYf0jLp';
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

const handleSiteMenuClick = (menuItem) => {
  const isStatisticsOpen = document.querySelector('.statistics');
  switch (menuItem) {
    case MenuItem.TABLE:
      if (isStatisticsOpen) {
        remove(statisticsComponent);
        siteMenuComponent.setMenuItem(MenuItem.TABLE);
        filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
        routePresenter.init();
      }
      break;
    case MenuItem.STATS:
      routePresenter.destroy();
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      filterPresenter.disable();
      statisticsComponent = new StatisticsView(eventsModel.get());
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
  const isStatisticsOpened = document.querySelector('.statistics');
  if (isStatisticsOpened) {
    remove(statisticsComponent);
    siteMenuComponent.setMenuItem(MenuItem.TABLE);
    filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    routePresenter.init();
  }

  routePresenter.createEvent();
  routePresenter.newEventFormOpenHandler();
});

filterPresenter.init();
routePresenter.init();


Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getEvents(),
])
  .then(([offers, destinations, events]) => {
    dataModel.setOffers(UpdateType.INIT, offers);
    dataModel.setDestinations(UpdateType.INIT, destinations);
    eventsModel.set(UpdateType.INIT, events);
    render(headerMenuContainer, siteMenuComponent, RenderPosition.BEFOREEND);
    render(headerMain, newEventButton, RenderPosition.BEFOREEND);
  })
  .catch(() => {
    dataModel.setOffers(UpdateType.INIT, []);
    eventsModel.set(UpdateType.INIT, []);
    dataModel.setDestinations(UpdateType.INIT, []);
  });


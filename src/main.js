import MenuView from './view/menu.js';
import FilterView from './view/trip-filter.js';
import TripInfoView from './view/trip-info.js';
import {generateEvent} from './mock/event-data.js';
import {render, RenderPosition} from './utils/render.js';
import dayjs from 'dayjs';
import RoutePresenter from './presenter/route.js';
import {destinationsArray} from './mock/destinations-data.js';


const headerMain = document.querySelector('.trip-main');
const pageMain = document.querySelector('.page-main');
const headerMenuContainer = headerMain.querySelector('.trip-controls__navigation');
const tripFilterContainer = headerMain.querySelector('.trip-controls__filters');
const pageContainer = pageMain.querySelector('.trip-events');

const EVENTS_COUNT = 15;

const routePresenter = new RoutePresenter(pageContainer);

const events = new Array(EVENTS_COUNT)
  .fill()
  .map(generateEvent)
  .sort((a, b) => dayjs(a.date_from) - dayjs(b.date_from));


if (events.length) {
  render(headerMain, new TripInfoView(events), RenderPosition.AFTERBEGIN);
}

render(headerMenuContainer, new MenuView(), RenderPosition.BEFOREEND);
render(tripFilterContainer, new FilterView(), RenderPosition.AFTERBEGIN);

routePresenter.init(events);

console.log(destinationsArray);

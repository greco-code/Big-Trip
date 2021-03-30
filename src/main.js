import {createSiteMenuTemplate} from './createSiteMenuTemplate';
import {createTripInfoTemplate} from './createTripInfoTemplate';
import {createTripFilterTemplate} from './createTripFilterTemplate';

const headerMain = document.querySelector('.trip-main');
const headerMenuContainer = headerMain.querySelector('.trip-controls__navigation');
const tripFilterContainer = headerMain.querySelector('.trip-controls__filters');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(headerMenuContainer, createSiteMenuTemplate(), 'beforeend');
render(headerMain, createTripInfoTemplate(), 'afterbegin');
render(tripFilterContainer, createTripFilterTemplate(), 'afterbegin');

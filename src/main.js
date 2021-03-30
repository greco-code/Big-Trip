import {createSiteMenuTemplate} from './createSiteMenuTemplate';
import {createTripInfoTemplate} from './createTripInfoTemplate';


const headerMain = document.querySelector('.trip-main');
const headerMenuContainer = headerMain.querySelector('.trip-controls__navigation');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(headerMenuContainer, createSiteMenuTemplate(), 'beforeend');
render(headerMain, createTripInfoTemplate(), 'afterbegin');

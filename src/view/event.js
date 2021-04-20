import {humanizeToMonthDay, humanizeToTime} from '../utils/time.js';
import Abstract from './abstract.js';

const generateOffers = (offers) => {
  let offersMarkup = '';

  offers.forEach(({price, title}) => {
    offersMarkup += `<li class="event__offer">
         <span class="event__offer-title">${title}</span>
           &plus;&euro;&nbsp;
         <span class="event__offer-price">${price}</span>
         </li>`;
  });
  return offersMarkup;
};

const createEventTemplate = (event) => {
  const {
    base_price,
    date_from,
    date_to,
    duration,
    destination,
    is_favorite,
    offers,
    type,
  } = event;

  const timeStart = humanizeToTime(date_from);
  const timeFinish = humanizeToTime(date_to);
  const eventDay = humanizeToMonthDay(date_from);

  const isFavourite = is_favorite ? 'event__favorite-btn--active' : '';
  const offersMarkup = generateOffers(offers);

  return `<div class="event">
            <time class="event__date" datetime="2019-03-18">${eventDay}</time>
            <div class="event__type">
              <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </div>
            <h3 class="event__title">${type} ${destination.name}</h3>
            <div class="event__schedule">
              <p class="event__time">
                <time class="event__start-time" datetime="2019-03-18T12:25">${timeStart}</time>
                &mdash;
                <time class="event__end-time" datetime="2019-03-18T13:35">${timeFinish}</time>
              </p>
              <p class="event__duration">${duration}</p>
            </div>
            <p class="event__price">
              &euro;&nbsp;<span class="event__price-value">${base_price}</span>
            </p>
            <h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
              ${offersMarkup}
            </ul>
            <button class="event__favorite-btn ${isFavourite}" type="button">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
            </button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </div>`;
};

export default class Event extends Abstract {
  constructor(event) {
    super();
    this._event = event;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._editClickHandler);
  }

  setFavouriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector('.event__favorite-btn ')
      .addEventListener('click', this._favoriteClickHandler);
  }
}

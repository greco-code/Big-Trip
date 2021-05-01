import {humanizeToFullDate} from '../utils/time.js';
import Smart from './smart.js';
import {TYPES} from '../mock/offers-data.js';
import {offers} from '../mock/offers-data.js';
import {destinations} from '../mock/destinations-data.js';

import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

// Возвращает список услуг
const generateOffers = (offers, id) => {
  let offerMarkup = '';

  offers.forEach((offer) => {
    offerMarkup +=
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${id}" type="checkbox" name="event-offer-${offer.title}">
            <label class="event__offer-label" for="event-offer-${offer.title}-${id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
       </div>`;
  });

  return offerMarkup;
};

// Возвращает список услуг В КОНТЕЙНЕРЕ
const generateOffersContainer = (offers, offersNumber, id) => {
  return offersNumber
    ? `<section class="event__section  event__section--offers">
         <h3 class="event__section-title  event__section-title--offers">Offers</h3>
         <div class="event__available-offers">
            ${generateOffers(offers, id)}
         </div>
       </section>`
    : '';
};

// Возвращает спсико фото
const generatePhotos = (destination, photosNumber) => {
  let photosMarkup = '';

  if (photosNumber) {
    for (let i = 0; i < photosNumber; i++) {
      photosMarkup +=
        `<img class="event__photo" src="${destination.pictures[i].src}" alt="${destination.pictures[i].description}">`;
    }
  }

  return photosMarkup;
};

// Возвращает список фото В КОНТЕЙНЕРЕ
const generatePhotosContainer = (destination, photosNumber) => {
  return photosNumber
    ? `<div class="event__photos-container">
          <div class="event__photos-tape">
            ${generatePhotos(destination, photosNumber)}
          </div>
        </div>`
    : '';
};

const generateOfferDescription = (destination, photosNumber) => {
  return destination.description
    ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        ${generatePhotosContainer(destination, photosNumber)}
      </section>`

    : '';
};

const generateTypesSelect = (id) => {
  return TYPES.map((type) => {
    return `<div class="event__type-item">
              <input id="event-type-${type.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
              <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${id}" data-type="${type}">${type}</label>
            </div>`;
  }).join(' ');
};

const generateDataList = () => {
  return destinations.map((destination) => {
    return `<option value="${destination.name}"></option>`;
  })
    .join('');
};


const createPointForm = (event) => {
  const {
    base_price,
    date_from,
    date_to,
    destination,
    type,
    offers,
    id,
  } = event;

  const timeStart = humanizeToFullDate(date_from);
  const timeFinish = humanizeToFullDate(date_to);
  const photosNumber = destination.pictures.length;
  const offersNumber = offers.length;
  const dataList = generateDataList();

  const offersList = generateOffersContainer(offers, offersNumber, id);
  const description = generateOfferDescription(destination, photosNumber, id);
  const typeSelectList = generateTypesSelect(id);

  return `<form class="event event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Event type</legend>
                    ${typeSelectList}
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${type}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                <datalist id="destination-list-1">
                  ${dataList}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">From</label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeStart}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeFinish}">
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${base_price}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Delete</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </header>
            <section class="event__details">
              ${offersList}
              ${description}
            </section>
          </form>`;
};

export default class EventForm extends Smart {
  constructor(event) {
    super();
    this._data = EventForm.parseEventToData(event);
    this._startDatepicker = null;
    this._finishDatepicker = null;

    this._eventClickHandler = this._eventClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._finishDateChangeHandler = this._finishDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setFinishDatepicker();
  }

  getTemplate() {
    return createPointForm(this._data);
  }

  setEventClickHandler(callback) {
    this._callback.eventClick = callback;
    this
      .getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._eventClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this
      .getElement()
      .addEventListener('submit', this._formSubmitHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setFinishDatepicker();
    this.setEventClickHandler(this._callback.eventClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  reset(event) {
    this.updateData(
      EventForm.parseEventToData(event),
    );
  }

  _eventClickHandler(evt) {
    evt.preventDefault();
    this._callback.eventClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventForm.parseEventToData(this._data));
  }

  _typeChangeHandler(evt) {
    const type = evt.target.dataset.type;

    const selectedArray = offers.find((element) => {
      return element.type === type;
    });

    evt.preventDefault();
    this.updateData({
      type,
      offers: selectedArray.offers,
    });
  }

  _destinationChangeHandler(evt) {
    const selectedDestination = evt.target.value;

    const selectedArray = destinations.find((element) => {
      return element.name === selectedDestination;
    });

    if (selectedArray) {
      this.updateData({
        destination: {
          description: selectedArray.description,
          name: selectedDestination,
          pictures: selectedArray.pictures,
        },
      });
    } else {
      evt.target.setCustomValidity('This name is unavailable');
      evt.target.reportValidity();
    }
  }

  //DATE//

  _startDateChangeHandler(date_from) {
    this.updateData(
      {
        date_from,
      },
    );
  }

  _finishDateChangeHandler(date_to) {
    this.updateData(
      {
        date_to,
      },
    );
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(
      this.getElement().querySelector('input[name = event-start-time]'),
      {
        enableTime: true,
        dateFormat: 'y/m/d H:i',
        minDate: dayjs().format('YY/MM/DD HH:MM'),
        onChange: this._startDateChangeHandler,
      },
    );
  }

  _setFinishDatepicker() {
    if (this._finishDatepicker) {
      this._finishDatepicker.destroy();
      this._finishDatepicker = null;
    }


    this._finishDatepicker = flatpickr(
      this.getElement().querySelector('input[name = event-end-time]'),
      {
        enableTime: true,
        dateFormat: 'y/m/d H:i',
        // minDate: this.getElement().querySelector('input[name = event-start-time]').value,
        minDate: dayjs(this._data.date_from).format('YY/MM/DD HH:MM'),
        onChange: this._finishDateChangeHandler,
      },
    );
  }

  //UTILS//

  _setInnerHandlers() {
    const selectItems = this.getElement().querySelectorAll('.event__type-label');
    selectItems.forEach((item) => {
      item.addEventListener('click', this._typeChangeHandler);
    });

    const destinationInputs = this.getElement().querySelectorAll('.event__input--destination');
    destinationInputs.forEach((item) => {
      item.addEventListener('change', this._destinationChangeHandler);
    });
  }

  static parseEventToData(event) {

    return Object.assign(
      {},
      event,
    );
  }
}

import {humanizeToFullDate} from '../utils/time.js';
import Smart from './smart.js';
import {offers, TYPES} from '../mock/offers-data.js';
import {destinations} from '../mock/destinations-data.js';

import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import he from 'he';
import {Mode} from '../const.js';
import {replaceSpace} from '../utils/random.js';

const BLANK_EVENT = {
  base_price: '',
  date_from: new Date(),
  date_to: new Date(),
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  id: '',
  is_favorite: false,
  offers: [],
  type: offers[0].type,
};

// Возвращает список услуг
const generateOffers = (offers, id, selectedOffers) => {
  let offerMarkup = '';

  offers.forEach((offer) => {
    const isOfferChecked = selectedOffers.includes(offer);
    const offerTitle = replaceSpace(offer.title);
    offerMarkup +=
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden"
            id="event-offer-${offerTitle}-${id}"
            type="checkbox"
            data-title=${offerTitle}
            name="event-offer-${offerTitle}" ${isOfferChecked ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${offerTitle}-${id}">
            <span class="event__offer-title">${offerTitle}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
       </div>`;
  });

  return offerMarkup;
};

// Возвращает список услуг В КОНТЕЙНЕРЕ
const generateOffersContainer = (offers, offersNumber, id, selectedOffers) => {
  return offersNumber
    ? `<section class="event__section  event__section--offers">
         <h3 class="event__section-title  event__section-title--offers">Offers</h3>
         <div class="event__available-offers">
            ${generateOffers(offers, id, selectedOffers)}
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


const createPointForm = (event, mode, availableOffers) => {

  const {
    base_price,
    date_from,
    date_to,
    destination,
    type,
    offers,
    id,
  } = event;


  const isAddMode = mode === Mode.ADDING ? 'true' : false;

  const timeStart = humanizeToFullDate(date_from);
  const timeFinish = humanizeToFullDate(date_to);
  const photosNumber = destination.pictures.length;
  const offersNumber = availableOffers.length;
  const dataList = generateDataList();

  const targetOffer = availableOffers.find((offer) => offer.type === type);
  const foundOffers = targetOffer && targetOffer.offers;
  const selectedOffers = offers;

  const offersList = generateOffersContainer(foundOffers, offersNumber, id, selectedOffers);
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
                <input class="event__input  event__input--destination"
                 id="event-destination-1"
                 type="text"
                 name="event-destination"
                 value="${he.encode(destination.name)}"
                 list="destination-list-1" required>
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
                <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${base_price}" required>
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">${isAddMode ? 'Cancel' : 'Delete'}</button>
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
  constructor(mode, event = BLANK_EVENT) {
    super();
    this._mode = mode;
    this._data = EventForm.parseEventToData(event);

    this._startDatepicker = null;
    this._finishDatepicker = null;

    this._availableOffers = offers;

    this._eventClickHandler = this._eventClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._eventDeleteClickHandler = this._eventDeleteClickHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._finishDateChangeHandler = this._finishDateChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setFinishDatepicker();
  }

  getTemplate() {
    return createPointForm(this._data, this._mode, this._availableOffers);
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

  setEventDeleteHandler(callback) {
    this._callback.eventDelete = callback;
    this
      .getElement()
      .querySelector('.event__reset-btn')
      .addEventListener('click', this._eventDeleteClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setFinishDatepicker();
    this.setEventClickHandler(this._callback.eventClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEventDeleteHandler(this._callback.eventDelete);
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

  _eventDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.eventDelete(EventForm.parseEventToData(this._data));
  }

  _typeChangeHandler(evt) {
    const type = evt.target.dataset.type;

    const targetType = offers.find((element) => {
      return element.type === type;
    });

    evt.preventDefault();
    this.updateData({
      type,
      offers: targetType.offers,
    });
  }

  _destinationChangeHandler(evt) {
    const selectedDestination = evt.target.value;

    const targetDestination = destinations.find((element) => {
      return element.name === selectedDestination;
    });

    if (targetDestination) {
      this.updateData({
        destination: {
          description: targetDestination.description,
          name: selectedDestination,
          pictures: targetDestination.pictures,
        },
      });
    } else {
      evt.target.setCustomValidity('This name is unavailable');
      evt.target.reportValidity();
    }
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData(
      {
        base_price: evt.target.value,
      }, true,
    );
  }

  _offersChangeHandler(evt) {
    const checkedOfferMarkup = evt.target.closest('div').querySelector('.event__offer-checkbox');
    let checkedOffers = this._data.offers;
    const currentType = evt.target.closest('.event--edit').querySelector('.event__type-output').textContent.trim();
    const offers = this._availableOffers;
    const availableOffers = (offers.find((offer) => offer.type === currentType)).offers;
    const checkedOffer = availableOffers.find((offer) => replaceSpace(offer.title) === checkedOfferMarkup.dataset.title);

    if (!checkedOfferMarkup.checked) {
      checkedOffers.push(checkedOffer);
    }

    if (checkedOfferMarkup.checked) {
      const offerToRemove = checkedOffers.find((offer) => offer === checkedOffer);

      checkedOffers = checkedOffers.filter((offer) => offer !== offerToRemove);
    }

    this.updateData(
      {
        offers: checkedOffers,
      },
    );
  }

  //DATE//

  _startDateChangeHandler([date_from]) {
    this.updateData(
      {
        date_from,
      }, true,
    );
  }

  _finishDateChangeHandler([date_to]) {
    this.updateData(
      {
        date_to,
      }, true,
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
        dateFormat: 'd/m/y H:i',
        minDate: dayjs().format('DD/MM/YY HH:MM'),
        onChange: this._startDateChangeHandler,
        time_24hr: true,
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
        dateFormat: 'd/m/y H:i',
        minDate: dayjs(this._data.date_from).format('DD/MM/YY HH:MM'),
        onChange: this._finishDateChangeHandler,
        time_24hr: true,
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

    const priceInputs = this.getElement().querySelectorAll('.event__input--price');
    priceInputs.forEach((item) => {
      item.addEventListener('input', this._priceInputHandler);
    });

    const offerCheckboxes = this.getElement().querySelectorAll('.event__offer-label');
    offerCheckboxes.forEach((item) => {
      item.addEventListener('click', this._offersChangeHandler);
    });
  }

  static parseEventToData(event) {

    return Object.assign(
      {},
      event,
    );
  }
}

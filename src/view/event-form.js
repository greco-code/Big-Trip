import {humanizeToFullDate} from '../utils/time.js';
import Smart from './smart.js';

import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import he from 'he';
import {replaceSpace} from '../utils/random.js';

// Возвращает список услуг
const generateOffers = (offers, id, selectedOffers, isDisabled) => {
  let offerMarkup = '';
  offers.forEach((offer) => {
    const selectedOffersTitles = selectedOffers && selectedOffers.map((offer) => offer.title);
    const isOfferChecked = selectedOffersTitles && selectedOffersTitles.includes(offer.title);
    const offerTitle = replaceSpace(offer.title);
    offerMarkup +=
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden"
            id="event-offer-${offerTitle}-${id}"
            type="checkbox"
            data-title=${offerTitle}
            name="event-offer-${offerTitle}" ${isOfferChecked ? 'checked' : ''}
            ${isDisabled ? 'disabled' : ''}>
          <label class="event__offer-label" for="event-offer-${offerTitle}-${id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
       </div>`;
  });

  return offerMarkup;
};

// Возвращает список услуг В КОНТЕЙНЕРЕ
const generateOffersContainer = (id, offers, selectedOffers, isDisabled) => {
  return offers && offers.length
    ? `<section class="event__section  event__section--offers">
         <h3 class="event__section-title  event__section-title--offers">Offers</h3>
         <div class="event__available-offers">
            ${generateOffers(offers, id, selectedOffers, isDisabled)}
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
const generatePhotosContainer = (destination) => {
  const photosNumber = destination && destination.pictures && destination.pictures.length;
  return photosNumber
    ? `<div class="event__photos-container">
          <div class="event__photos-tape">
            ${generatePhotos(destination, photosNumber)}
          </div>
        </div>`
    : '';
};

const generateOfferDescription = (destination) => {
  return destination.description
    ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
        ${generatePhotosContainer(destination, destination.pictures.length)}
      </section>`

    : '';
};

const generateTypesSelect = (id, types, isDisabled) => {
  return types.map((type) => {
    return `<div class="event__type-item">
              <input id="event-type-${type.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isDisabled ? 'disabled' : ''}>
              <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${id}" data-type="${type}">${type}</label>
            </div>`;
  }).join(' ');
};

const generateDestinationsSelectMarkup = (destinations) => {
  return destinations.map((destination) => {
    return `<option value="${destination.name}"></option>`;
  })
    .join('');
};


const createPointForm = (event, availableOffers, destinations) => {
  const price = event.base_price;
  const dateFrom = event.date_from || new Date();
  const dateTo = event.date_to || new Date();
  const destination = event.destination;
  const type = event.type || availableOffers[0].type;
  const id = event.id;
  const isNew = !event.id;
  const offersByType = availableOffers.find((offer) => offer.type === type).offers;
  const isDeleting = event.isDeleting;
  const isSaving = event.isSaving;
  const isDisabled = event.isDisabled;

  const timeStart = humanizeToFullDate(dateFrom);
  const timeFinish = humanizeToFullDate(dateTo);
  const destinationsSelectMarkup = generateDestinationsSelectMarkup(destinations);

  const offersMarkup = generateOffersContainer(id, offersByType, event.offers, isDisabled);
  const description = destination ? generateOfferDescription(destination, id) : '';
  const types = availableOffers.map((offer) => offer.type);
  const typeSelectList = generateTypesSelect(id, types, isDisabled);

  return `<form class="event event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
                 value="${destination ? he.encode(destination.name) : ''}"
                 list="destination-list-1" required
                 ${isDisabled ? 'disabled' : ''}>
                <datalist id="destination-list-1">
                  ${destinationsSelectMarkup}
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">From</label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeStart}" ${isDisabled ? 'disabled' : ''}>
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">To</label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeFinish}" ${isDisabled ? 'disabled' : ''}>
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${price}" required ${isDisabled ? 'disabled' : ''}>
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
               ${isSaving ? 'Saving' : 'Save'}
              </button>
              <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isNew ? 'Cancel' : isDeleting ? 'Deleting' : 'Delete'}</button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </header>
            <section class="event__details">
              ${offersMarkup}
              ${description}
            </section>
          </form>`;
};

export default class EventForm extends Smart {
  constructor(event = {}, offers, destinations) {
    super();
    this._data = EventForm.parseEventToData(event);

    this._startDatepicker = null;
    this._finishDatepicker = null;

    this._offers = offers;
    this._destinations = destinations;

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
    return createPointForm(this._data, this._offers, this._destinations);
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
    evt.preventDefault();
    this.updateData({
      type,
    });
  }

  _destinationChangeHandler(evt) {
    const selectedDestination = evt.target.value;

    const targetDestination = this._destinations.find((element) => {
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
        base_price: Number.parseInt(evt.target.value),
      }, true,
    );
  }

  _offersChangeHandler(evt) {
    const checkedOfferElement = evt.target.closest('div').querySelector('.event__offer-checkbox');
    const checkedOfferTitle = checkedOfferElement && checkedOfferElement.dataset.title;
    const isChecked = checkedOfferElement.checked;

    const selectedType = evt.target.closest('.event--edit').querySelector('.event__type-output').textContent.trim();
    const targetType = this._offers.find((offer) => offer.type === selectedType);
    const availableOffers = targetType && targetType.offers;

    const checkedOffer = checkedOfferTitle && availableOffers.find((offer) => replaceSpace(offer.title) === checkedOfferTitle);

    if (!this._data.offers) {
      this._data.offers = [];
    }

    const checkedOffers = this._data.offers.slice();

    if (isChecked) {
      this._data.offers.push(checkedOffer);
    } else {
      this._data.offers = checkedOffers.filter((offer) => replaceSpace(offer.title) !== checkedOfferTitle);
    }

    this.updateData(
      {
        offers: this._data.offers.slice(),
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

    const offerCheckboxes = this.getElement().querySelectorAll('.event__offer-checkbox');
    offerCheckboxes.forEach((item) => {
      item.addEventListener('change', this._offersChangeHandler);
    });
  }

  static parseEventToData(event) {
    event = Object.assign(
      {},
      event,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );

    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;

    return event;
  }
}

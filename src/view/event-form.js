import {createElement, humanizeToFullDate} from '../util';

// Возвращает список услуг
const generateOffers = (offers, id) => {
  let offerMarkup = '';

  offers.forEach((offer) => {
    offerMarkup +=
      `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-${id}" type="checkbox" name="event-offer-${offer.type}">
            <label class="event__offer-label" for="event-offer-${offer.type}-${id}">
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

const createPointForm = (event) => {
  const {
    base_price,
    date_from,
    date_to,
    destination,
    id,
    offers,
  } = event;

  const timeStart = humanizeToFullDate(date_from);
  const timeFinish = humanizeToFullDate(date_to);
  const photosNumber = destination.pictures.length;
  const offersNumber = offers.length;

  const offersList = generateOffersContainer(offers, offersNumber, id);
  const description = generateOfferDescription(destination, photosNumber, id);

  return `<form class="event event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Event type</legend>

                    <div class="event__type-item">
                      <input id="event-type-taxi-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                      <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-${id}">Taxi</label>
                    </div>

                    <div class="event__type-item">
                      <input id="event-type-bus-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                      <label class="event__type-label  event__type-label--bus" for="event-type-bus-${id}">Bus</label>
                    </div>

                    <div class="event__type-item">
                      <input id="event-type-train-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                      <label class="event__type-label  event__type-label--train" for="event-type-train-${id}">Train</label>
                    </div>

                    <div class="event__type-item">
                      <input id="event-type-ship-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                      <label class="event__type-label  event__type-label--ship" for="event-type-ship-${id}">Ship</label>
                    </div>

                    <div class="event__type-item">
                      <input id="event-type-transport-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                      <label class="event__type-label  event__type-label--transport" for="event-type-transport-${id}">Transport</label>
                    </div>

                    <div class="event__type-item">
                      <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                      <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                    </div>

                    <div class="event__type-item">
                      <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                      <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                    </div>

                    <div class="event__type-item">
                      <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                      <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                    </div>

                    <div class="event__type-item">
                      <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                      <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                    </div>

                    <div class="event__type-item">
                      <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                      <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  Flight
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                <datalist id="destination-list-1">
                  <option value="Amsterdam"></option>
                  <option value="Geneva"></option>
                  <option value="Chamonix"></option>
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

export default class EventForm {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createPointForm(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

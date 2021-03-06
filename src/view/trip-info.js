import {humanizeToMonthDay} from '../utils/time.js';
import Abstract from './abstract.js';


const getRoute = (events) => {
  const countriesSet = new Set();

  events.forEach((event) => {
    countriesSet.add(event.destination.name);
  });

  const countries = Array.from(countriesSet);
  let routeMarkup = '';

  const lastIndex = countries.length - 1;

  if (countries.length === 1) {
    routeMarkup = `<h1 class="trip-info__title">${countries[0]}</h1>`;
  } else if (countries.length === 2) {
    routeMarkup = `<h1 class="trip-info__title">${countries[0]} &mdash; ${countries[1]}</h1>`;
  } else if (countries.length === 3) {
    routeMarkup = `<h1 class="trip-info__title">${countries[0]} &mdash; ${countries[1]} &mdash; ${countries[2]}</h1>`;
  } else if (countries.length > 3) {
    routeMarkup = `<h1 class="trip-info__title">${countries[0]} &mdash; ... &mdash; ${countries[lastIndex]}</h1>`;
  }

  return routeMarkup;
};

const getPrice = (events) => {
  let price = 0;

  events.forEach(({basePrice}) => {
    price += basePrice;
  });

  return price;
};

const getDuration = (events) => {
  let duration;
  const lastIndex = events.length - 1;
  const startDate = events[0].dateFrom;
  const finishDate = events[lastIndex].dateTo;

  if (startDate.getMonth() === finishDate.getMonth()) {
    duration = `${humanizeToMonthDay(startDate)} &mdash; ${finishDate.getDate()}`;
  } else {
    duration = `${humanizeToMonthDay(startDate)} &mdash; ${humanizeToMonthDay(finishDate)}`;
  }

  return duration;
};


const createTripInfoTemplate = (events) => {
  const route = getRoute(events);
  const price = getPrice(events);
  const duration = getDuration(events);

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              ${route}

              <p class="trip-info__dates">${duration}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
            </p>
          </section>`;
};

export default class TripInfo extends Abstract {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}

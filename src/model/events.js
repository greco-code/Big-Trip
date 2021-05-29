import Observer from '../utils/observer.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  get() {
    return this._events;
  }

  set(updateType, events) {
    this._events = events.slice();

    this._notify(updateType);
  }

  update(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  add(updateType, update) {
    this._events = [
      update,
      ...this._events,
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvents =  Object.assign(
      {},
      event,
      {
        basePrice: Number(event.base_price),
        isFavorite: event.is_favorite,
        dateFrom: event.date_from !== null ? new Date(event.date_from) : event.date_from,
        dateTo: event.date_to !== null ? new Date(event.date_to) : event.date_to,
      },
    );

    delete adaptedEvents.base_price;
    delete adaptedEvents.date_from;
    delete adaptedEvents.date_to;
    delete adaptedEvents.is_favorite;

    return adaptedEvents;
  }

  static adaptToServer(event) {
    const adaptedTripEvent =  Object.assign(
      {},
      event,
      {
        'base_price': event.basePrice,
        'is_favorite': event.isFavorite,
        'date_from': event.dateFrom instanceof Date ? event.dateFrom.toISOString() : null,
        'date_to': event.dateTo instanceof Date ? event.dateTo.toISOString() : null,
      },
    );

    delete adaptedTripEvent.basePrice;
    delete adaptedTripEvent.dateFrom;
    delete adaptedTripEvent.isFavorite;
    delete adaptedTripEvent.dateTo;

    return adaptedTripEvent;
  }
}

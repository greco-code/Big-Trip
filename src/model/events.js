import Observer from '../utils/observer.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(events) {
    this._events = events.slice();
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
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

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
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
    return Object.assign(
      {},
      event,
      {
        date_from: event.date_from !== null ? new Date(event.date_from) : event.date_from,
        date_to: event.date_to !== null ? new Date(event.date_to) : event.date_to,
      },
    );
  }

  static adaptToServer(event) {
    return Object.assign(
      {},
      event,
      {
        date_from: event.date_from instanceof Date ? event.date_from.toISOString() : null,
        date_to: event.date_to instanceof Date ? event.date_to.toISOString() : null,
      },
    );
  }
}

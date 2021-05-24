import Observer from '../utils/observer.js';

export default class Data extends Observer {
  constructor() {
    super();
    this._offers = [];
    this._destinations = [];
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(updateType, offers) {
    // offers.forEach((offer) => this._offers.set(offer.type, offer.offers));
    this._offers = offers.slice();

    this._notify(updateType);
  }

  setDestinations(updateType, destinations) {
    this._destinations = destinations.slice();

    this._notify(updateType);
  }
}

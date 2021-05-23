import Observer from '../utils/observer.js';

export default class Data extends Observer{
  constructor() {
    super();
    this._offers = new Map();
    this._destinations = [];
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(offers) {
    offers.forEach((offer) => this._offers.set(offer.type, offer.offers));
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }
}

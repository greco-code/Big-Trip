import {createElement} from '../util.js';

export const createEventItemContainerTemplate = () => {
  return `<li class="trip-events__item">
          </li>`;
};

export default class EventListItem {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventItemContainerTemplate();
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

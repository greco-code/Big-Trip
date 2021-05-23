import Abstract from './abstract.js';
import {MenuItem} from '../const.js';

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" data-type=${MenuItem.TABLE} href="#">${MenuItem.TABLE}</a>
            <a class="trip-tabs__btn" data-type=${MenuItem.STATS} href="#">${MenuItem.STATS}</a>
          </nav>`;
};

export default class Menu extends Abstract {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.type);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const checkedItem = this.getElement().querySelector(`[data-type ~= ${menuItem}]`);
    const itemsToUncheck = this.getElement().querySelectorAll('.trip-tabs__btn--active');

    if (checkedItem !== null) {
      itemsToUncheck.forEach((item) => {
        item.classList.remove('trip-tabs__btn--active');
        checkedItem.classList.add('trip-tabs__btn--active');
      });
    }
  }
}


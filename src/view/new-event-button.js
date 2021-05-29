import Abstract from './abstract.js';

const createNewEventButton = () => {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
};

export default class NewEventButton extends Abstract {
  constructor() {
    super();
    this._newEventClickHandler = this._newEventClickHandler.bind(this);
  }

  getTemplate() {
    return createNewEventButton();
  }

  _newEventClickHandler(evt) {
    evt.preventDefault();
    this._callback.newEventButtonClick();
  }

  setNewEventClickHandler(callback) {
    this._callback.newEventButtonClick = callback;
    this
      .getElement()
      .addEventListener('click', this._newEventClickHandler);
  }
}

import {render, remove} from '../utils/render.js';
import EventFormView from '../view/event-form.js';
import {RenderPosition, UpdateType, UserAction} from '../const.js';
import {nanoid} from 'nanoid';

export default class PointNew {
  constructor(eventContainer, changeData, offers, destinations) {
    this._eventContainer = eventContainer;
    this._changeData = changeData;

    this._offers = offers;
    this._destinations = destinations;

    this._eventFormComponent = null;

    this._addNewEventButton = document.querySelector('.trip-main__event-add-btn');

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleEventClick = this._handleEventClick.bind(this);
  }

  init() {
    this._eventFormComponent = new EventFormView(
      {
        date_from: new Date(),
        date_to: new Date(),
        type: this._offers[0].type,
        is_favorite: false,
        offers: [],
      },
      this._offers,
      this._destinations,
    );

    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setEventDeleteHandler(this._handleDeleteClick);
    this._eventFormComponent.setEventClickHandler(this._handleEventClick);

    this._addNewEventButton.disabled = true;

    render(this._eventContainer, this._eventFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }

    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleEventClick() {
    this.destroy();
  }

  _handleFormSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, event),
    );

    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleDeleteClick() {
    this.destroy();
  }

  destroy() {
    remove(this._eventContainer);

    if (this._eventFormComponent) {
      remove(this._eventFormComponent);
    }

    if (this._addNewEventButton) {
      this._addNewEventButton.disabled = false;
    }
  }
}


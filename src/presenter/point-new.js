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

    this._newEventFormComponent = null;

    this._addNewEventButton = document.querySelector('.trip-main__event-add-btn');

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._eventClickHandler = this._eventClickHandler.bind(this);
  }

  init() {
    this._newEventFormComponent = new EventFormView(
      {
        dateFrom: new Date(),
        dateTo: new Date(),
        type: this._offers[0].type,
        isFavorite: false,
        offers: [],
      },
      this._offers,
      this._destinations,
    );

    this._newEventFormComponent.setInnerDatePicker();
    this._newEventFormComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._newEventFormComponent.setEventDeleteHandler(this._deleteClickHandler);
    this._newEventFormComponent.setEventClickHandler(this._eventClickHandler);

    this._addNewEventButton.disabled = true;

    render(this._eventContainer, this._newEventFormComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._newEventFormComponent.updateData({
      isSaving: true,
      isDisabled: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._newEventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._newEventFormComponent.shake(resetFormState);
  }

  destroy() {
    if (this._newEventFormComponent) {
      this._newEventFormComponent.removeDatePicker();
      remove(this._newEventFormComponent);
      remove(this._eventContainer);
    }

    if (this._addNewEventButton) {
      this._addNewEventButton.disabled = false;
    }

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _eventClickHandler() {
    this.destroy();
  }

  _formSubmitHandler(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, event),
    );

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _deleteClickHandler() {
    this.destroy();
  }
}


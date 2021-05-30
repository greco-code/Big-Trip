import {render, replace, remove} from '../utils/render.js';
import EventView from '../view/event.js';
import EventFormView from '../view/event-form.js';
import {Mode, RenderPosition, UpdateType, UserAction} from '../const.js';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Point {
  constructor(eventContainer, changeData, changeMode, offers, destinations) {
    this._eventContainer = eventContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventFormComponent = null;
    this._mode = Mode.DEFAULT;

    this._offers = offers;
    this._destinations = destinations;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._eventClickHandler = this._eventClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventFormComponent = this._eventFormComponent;

    this._eventComponent = new EventView(this._event);
    this._eventFormComponent = new EventFormView(this._event, this._offers, this._destinations);

    this._eventComponent.setEditClickHandler(this._editClickHandler);
    this._eventComponent.setFavouriteClickHandler(this._favoriteClickHandler);
    this._eventFormComponent.setEventClickHandler(this._eventClickHandler);
    this._eventFormComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._eventFormComponent.setEventDeleteHandler(this._deleteClickHandler);


    if (prevEventComponent === null || prevEventFormComponent === null) {
      render(this._eventContainer, this._eventComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponent, prevEventFormComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventFormComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventFormComponent.updateData({
          isSaving: true,
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._eventFormComponent.updateData({
          isDeleting: true,
          isDisabled: true,
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventFormComponent.shake(resetFormState);
        break;
    }
  }

  destroy() {
    remove(this._eventContainer);
    remove(this._eventFormComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._eventFormComponent, this._eventComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventFormComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._eventFormComponent.reset(this._event);
      this._eventFormComponent.removeDatePicker();
      this._replaceFormToEvent();
    }
  }

  _editClickHandler() {
    this._replaceEventToForm();
    this._eventFormComponent.reset(this._event);
    this._eventFormComponent.setInnerDatePicker();
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _eventClickHandler() {
    this._replaceFormToEvent();
    this._eventFormComponent.removeDatePicker();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _formSubmitHandler(event) {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      event,
    );

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _deleteClickHandler(event) {
    this._changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _favoriteClickHandler() {
    this._changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._event,
        {
          isFavorite: !this._event.isFavorite,
        },
      ),
    );
  }
}

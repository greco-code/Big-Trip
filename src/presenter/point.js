import {render, RenderPosition, replace, remove} from '../utils/render.js';
import EventView from '../view/event.js';
import EventFormView from '../view/event-form.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(eventContainer, changeData, changeMode) {
    this._eventContainer = eventContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._eventComponent = null;
    this._eventFormComponent = null;
    this._mode = Mode.DEFAULT;


    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleEventClick = this._handleEventClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventFormComponent = this._eventFormComponent;

    this._eventComponent = new EventView(this._event);
    this._eventFormComponent = new EventFormView(this._event);

    this._eventComponent.setEditClickHandler(this._handleEditClick);
    this._eventComponent.setFavouriteClickHandler(this._handleFavoriteClick);
    this._eventFormComponent.setEventClickHandler(this._handleEventClick);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);


    if (prevEventComponent === null || prevEventFormComponent === null) {
      render(this._eventContainer, this._eventComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventFormComponent, prevEventFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEventFormComponent);
  }

  _replaceEventToForm() {
    replace(this._eventFormComponent, this._eventComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventFormComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._eventFormComponent.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  _handleEditClick() {
    this._replaceEventToForm();
    this._eventFormComponent.reset(this._event);
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _handleEventClick() {
    this._replaceFormToEvent();
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleFormSubmit() {
    this._replaceFormToEvent();
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._event,
        {
          is_favorite: !this._event.is_favorite,
        },
      ),
    );
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
}

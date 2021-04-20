import {render, RenderPosition, replace, remove} from '../utils/render.js';
import EventView from '../view/event.js';
import EventFormView from '../view/event-form.js';

export default class Point {
  constructor(eventContainer, changeData) {
    this._eventContainer = eventContainer;
    this._changeData = changeData;

    this._eventComponent = null;
    this._eventFormComponent = null;


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
    this._eventFormComponent.setFromSubmitHandler(this._handleFormSubmit);


    if (prevEventComponent === null || prevEventFormComponent === null) {
      render(this._eventContainer, this._eventComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    if (this._eventContainer.getElement().contains(prevEventComponent.getElement())) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._eventContainer.getElement().contains(prevEventFormComponent.getElement())) {
      replace(this._eventFormComponent, prevEventFormComponent);
    }

    remove(prevEventComponent);
    remove(prevEventFormComponent);
  }

  _replaceEventToForm() {
    replace(this._eventFormComponent, this._eventComponent);
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventFormComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }

  _handleEditClick() {
    this._replaceEventToForm();
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
    remove(this._eventComponent);
    remove(this._eventFormComponent);
  }
}

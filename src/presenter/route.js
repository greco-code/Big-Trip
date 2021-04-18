import EventListItemView from '../view/event-item-container.js';
import EventListView from '../view/event-list-container.js';
import EventView from '../view/event.js';
import EventFormView from '../view/event-form.js';
import NoEventView from '../view/no-event.js';
import {render, RenderPosition, replace} from '../utils/render.js';

export default class Route {
  constructor(eventsContainer) {
    this._eventsContainer = eventsContainer;
    this._noEvent = new NoEventView();
    this._eventList = new EventListView();
    this._eventListItem = new EventListItemView();
  }

  init(events) {
    this._events = events.slice();
    this._renderBoard();
  }

  _renderEventsList() {
    render(this._eventsContainer, this._eventList, RenderPosition.BEFOREEND);
  }

  _renderEventContainer() {
    render(this._eventList, this._eventListItem, RenderPosition.BEFOREEND );
  }

  _renderEvent(event)  {
    this._renderEventContainer();
    const eventComponent = new EventView(event);
    render(this._eventListItem, eventComponent, RenderPosition.AFTERBEGIN);
    const eventForm = new EventFormView(event);

    const replaceEventToForm = () => {
      replace(eventForm, eventComponent);
    };

    const replaceFormToEvent = () => {
      replace(eventComponent, eventForm);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventComponent.setEditClickHandler(() => {
      replaceEventToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    eventForm.setEventClickHandler(() => {
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    eventForm.setFromSubmitHandler(() => {
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  }

  _renderEvents(events) {
    events
      .forEach((event) => {
        this._renderEvent(event);
        this._eventListItem = new EventListItemView();
      });
  }

  _renderNoEvent() {
    render(this._eventsContainer, new NoEventView(), RenderPosition.AFTERBEGIN);
  }

  _renderBoard() {
    if (!this._events.length) {
      this._renderNoEvent();
    }

    if (this._events.length) {
      this._renderEventsList();
    }

    this._renderEvents(this._events);
  }
}

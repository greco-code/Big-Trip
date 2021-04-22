import EventListItemView from '../view/event-item-container.js';
import EventListView from '../view/event-list-container.js';
import NoEventView from '../view/no-event.js';
import PointPresenter from '../presenter/point.js';
import {render, RenderPosition, updateItem} from '../utils/render.js';

export default class Route {
  constructor(eventsContainer) {
    this._eventsContainer = eventsContainer;
    this._noEvent = new NoEventView();
    this._eventList = new EventListView();
    this._eventListItem = new EventListItemView();
    this._pointPresenter = {};

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._renderBoard();
  }

  _handleEventChange(updateEvent) {
    this._events = updateItem(this._events, updateEvent);
    this._pointPresenter[updateEvent.id].init(updateEvent);
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderEventsList() {
    render(this._eventsContainer, this._eventList, RenderPosition.BEFOREEND);
  }

  _renderEventContainer() {
    render(this._eventList, this._eventListItem, RenderPosition.BEFOREEND );
  }

  _renderEvent(event)  {
    this._renderEventContainer();
    const pointPresenter = new PointPresenter(this._eventListItem, this._handleEventChange, this._handleModeChange);
    pointPresenter.init(event);
    this._pointPresenter[event.id] = pointPresenter;
  }

  _renderEvents(events) {
    events
      .forEach((event) => {
        this._renderEvent(event);
        this._eventListItem = new EventListItemView();
      });
  }

  _clearEvents() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
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

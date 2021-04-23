import EventListItemView from '../view/event-item-container.js';
import EventListView from '../view/event-list-container.js';
import NoEventView from '../view/no-event.js';
import PointPresenter from '../presenter/point.js';
import SortView from '../view/trip-sort.js';
// import SortType from '../view/trip-sort.js';
import {render, RenderPosition, updateItem} from '../utils/render.js';
import dayjs from 'dayjs';

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export default class Route {
  constructor(eventsContainer) {
    this._eventsContainer = eventsContainer;
    this._noEvent = new NoEventView();
    this._eventList = new EventListView();
    this._eventListItem = new EventListItemView();
    this._pointPresenter = {};
    this._sort = new SortView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._currentSortType = SortType.DAY;
  }

  init(events) {
    this._events = events.slice();
    this._renderBoard();
    this._defaultSort = events.slice();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._defaultSort = updateItem(this._defaultSort, updatedEvent);
    this._pointPresenter[updatedEvent.id].init(updatedEvent);
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._events.sort((a, b) => dayjs(a.date_to - a.date_from) - (b.date_to - b.date_from));
        break;
      case SortType.PRICE:
        this._events.sort((a, b) => (a.base_price) - (b.base_price));
        break;
      default:
        this._events = this._defaultSort;
    }

    this._currentSortType = sortType;
    this._clearEvents();
    this._renderEvents(this._events);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
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
    render(this._eventList, this._eventListItem, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
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
    render(this._eventsContainer, this._noEvent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._eventsContainer, this._sort, RenderPosition.AFTERBEGIN);
    this._sort.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderBoard() {
    if (!this._events.length) {
      this._renderNoEvent();
    }

    if (this._events.length) {
      this._renderEventsList();
      this._renderSort();
    }

    this._renderEvents(this._events);
  }
}

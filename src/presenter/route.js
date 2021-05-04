import EventListItemView from '../view/event-item-container.js';
import EventListView from '../view/event-list-container.js';
import NoEventView from '../view/no-event.js';
import PointPresenter from '../presenter/point.js';
import SortView from '../view/trip-sort.js';
import {render, RenderPosition} from '../utils/render.js';
import {SortType} from '../const.js';
import dayjs from 'dayjs';

export default class Route {
  constructor(eventsContainer, eventsModel) {
    this._eventsModel = eventsModel;
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

  init() {
    this._renderBoard();
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._eventsModel.getEvents().slice().sort((a, b) => dayjs(a.date_to - a.date_from) - (b.date_to - b.date_from));
      case SortType.PRICE:
        return this._eventsModel.getEvents().slice().sort((a, b) => (a.base_price) - (b.base_price));
      case SortType.DAY:
        return this._eventsModel.getEvents().slice().sort((a, b) => dayjs(a.date_from) - dayjs(b.date_from));
    }

    return this._eventsModel.getEvents();
  }

  _handleEventChange(updatedEvent) {
    this._pointPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearEvents();
    this._renderEvents();
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
    if (!this._getEvents().length) {
      this._renderNoEvent();
    }

    if (this._getEvents().length) {
      this._renderEventsList();
      this._renderSort();
    }

    this._renderEvents(this._getEvents());
  }
}

import EventListItemView from '../view/event-item-container.js';
import EventListView from '../view/event-list-container.js';
import NoEventView from '../view/no-event.js';
import PointPresenter from '../presenter/point.js';
import SortView from '../view/trip-sort.js';
import {remove, render} from '../utils/render.js';
import {RenderPosition, SortType, UpdateType, UserAction} from '../const.js';
import dayjs from 'dayjs';
import {filter} from '../utils/filter.js';

export default class Route {
  constructor(eventsContainer, eventsModel, filtersModel) {
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;
    this._eventsContainer = eventsContainer;
    this._noEvent = new NoEventView();
    this._eventList = new EventListView();
    this._eventListItem = new EventListItemView();
    this._pointPresenter = {};
    this._sort = new SortView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._currentSortType = SortType.DAY;

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getEvents() {
    const filtersType = this._filtersModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filtersType](events);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort((a, b) => dayjs(a.date_to - a.date_from) - (b.date_to - b.date_from));
      case SortType.PRICE:
        return filteredEvents.sort((a, b) => (a.base_price) - (b.base_price));
      case SortType.DAY:
        return filteredEvents.sort((a, b) => dayjs(a.date_from) - dayjs(b.date_from));
    }

    return filteredEvents;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
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
    const pointPresenter = new PointPresenter(this._eventListItem, this._handleViewAction, this._handleModeChange);
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

  _clearBoard(resetSortType = false) {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};

    remove(this._sort);
    remove(this._noEvent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
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

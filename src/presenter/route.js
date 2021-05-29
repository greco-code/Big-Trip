import EventListItemView from '../view/event-item-container.js';
import EventListView from '../view/event-list-container.js';
import NoEventView from '../view/no-event.js';
import PointPresenter, {State as PointPresenterViewState} from '../presenter/point.js';
import PointNewPresenter from './point-new.js';
import SortView from '../view/trip-sort.js';
import {remove, render} from '../utils/render.js';
import {RenderPosition, SortType, UpdateType, UserAction, FilterType} from '../const.js';
import dayjs from 'dayjs';
import {filter} from '../utils/filter.js';
import LoadingView from '../view/loading.js';

export default class Route {
  constructor(eventsContainer, eventsModel, filtersModel, dataModel, api) {
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;
    this._dataModel = dataModel;

    this._eventsContainer = eventsContainer;

    this._noEvent = new NoEventView();
    this._eventListItem = new EventListItemView();
    this._loaderComponent = new LoadingView();

    this._pointNewPresenter = new PointNewPresenter(this._eventListItem, this._handleViewAction, this._offers, this._destinations);
    this._pointPresenter = {};

    this._isLoading = true;
    this._api = api;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this.handleNewEventFormOpen = this.handleNewEventFormOpen.bind(this);

    this._currentSortType = SortType.DAY;
  }

  init() {
    this._renderBoard();

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
    this._dataModel.addObserver(this._handleModelEvent);
  }

  _getEvents() {
    const filtersType = this._filtersModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filtersType](events);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort((a, b) => dayjs(a.dateTo - a.dateFrom) - (b.dateTo - b.dateFrom));
      case SortType.PRICE:
        return filteredEvents.sort((a, b) => (a.basePrice) - (b.basePrice));
      case SortType.DAY:
        return filteredEvents.sort((a, b) => dayjs(b.dateFrom) - dayjs(a.dateFrom));
    }

    return filteredEvents;
  }

  createEvent() {
    this._currentSortType = SortType.DAY;
    this._filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (!this._eventList) {
      this._renderEventsList();
    }

    this._eventListItem = new EventListItemView();
    this._renderEventContainer();

    this._pointNewPresenter = new PointNewPresenter(this._eventListItem, this._handleViewAction, this._offers, this._destinations);
    this._pointNewPresenter.init();

    if (this._noEvent) {
      remove(this._noEvent);
    }
  }

  destroy() {
    this._clearBoard({resetSortType: true});

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filtersModel.removeObserver(this._handleModelEvent);
  }

  //HANDLERS//
  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updateEvent(update).then((response) => {
          this._eventsModel.updateEvent(updateType, response);
        })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._pointNewPresenter.setSaving();
        this._api.addEvent(update).then((response) => {
          this._eventsModel.addEvent(updateType, response);
        })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deleteEvent(update).then(() => {
          this._eventsModel.deleteEvent(updateType, update);
        })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loaderComponent);
        this._clearBoard();
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
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  handleNewEventFormOpen() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  //RENDERS//
  _renderEventsList() {
    this._eventList = new EventListView();
    render(this._eventsContainer, this._eventList, RenderPosition.BEFOREEND);
  }

  _renderEventContainer() {
    render(this._eventList, this._eventListItem, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(event) {
    this._renderEventContainer();
    const pointPresenter = new PointPresenter(this._eventListItem, this._handleViewAction, this._handleModeChange, this._offers, this._destinations);
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

  _renderNoEvent() {
    render(this._eventsContainer, this._noEvent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._eventsContainer, this._loaderComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    this._sort = new SortView(this._currentSortType);
    render(this._eventsContainer, this._sort, RenderPosition.AFTERBEGIN);
    this._sort.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderBoard() {
    this._offers = this._dataModel.getOffers();
    this._destinations = this._dataModel.getDestinations();

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getEvents().length === 0) {
      this._renderNoEvent();
    }

    if (this._getEvents().length) {
      this._renderEventsList();
      this._renderSort();
      remove(this._noEvent);
    }

    this._renderEvents(this._getEvents());
  }

  _clearBoard(resetSortType = false) {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
    this._pointNewPresenter.destroy();

    if (this._sort) {
      remove(this._sort);
    }

    remove(this._noEvent);
    remove(this._loaderComponent);
    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }
}

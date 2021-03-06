import FilterView from '../view/filter.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, RenderPosition, UpdateType} from '../const.js';

export default class Filter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;

    this._filterComponent = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._eventsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  init() {
    const filters = this._get();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.get());
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  disable() {
    const inputs = this._filterComponent.getElement().querySelectorAll('.trip-filters__filter-input');
    inputs.forEach((input) => {
      input.disabled = true;
    });
  }

  _get() {
    const events = this._eventsModel.get();

    return [
      {
        type: FilterType.EVERYTHING,
        name: FilterType.EVERYTHING,
        count: filter[FilterType.EVERYTHING](events).length,
      },
      {
        type: FilterType.FUTURE,
        name: FilterType.FUTURE,
        count: filter[FilterType.FUTURE](events).length,
      },
      {
        type: FilterType.PAST,
        name: FilterType.PAST,
        count: filter[FilterType.PAST](events).length,
      },
    ];
  }

  _modelEventHandler() {
    this.init();
  }

  _filterTypeChangeHandler(filterType) {
    if (this._filterModel.get() === filterType) {
      return;
    }

    this._filterModel.set(UpdateType.MAJOR, filterType);
  }
}

import {render, remove} from '../framework/render.js';
import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import EmptyListView from '../view/empty-list.js';
import LoadingView from '../view/loading.js';
import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import {filter} from '../utils/filter.js';
import {FilterType, SortType, UpdateType, UserAction} from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

function sortPointByDay(pointA, pointB) {
  return new Date(pointA.dateFrom) - new Date(pointB.dateFrom);
}

function sortPointByTime(pointA, pointB) {
  const durationA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const durationB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);

  return durationB - durationA;
}

function sortPointByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export default class TripPresenter {
  #pointPresenters = new Map();
  #tripEventsContainer = null;
  #tripModel = null;
  #filterModel = null;
  #tripEventsListComponent = new ListView();
  #sortComponent = null;
  #emptyListComponent = null;
  #loadingComponent = new LoadingView();
  #pointNewPresenter = null;
  #handleNewPointDestroy = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  #currentSortType = SortType.DAY;

  constructor({tripEventsContainer, tripModel, filterModel, onNewPointDestroy = () => {}}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#handleNewPointDestroy = onNewPointDestroy;

    this.#tripModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#getPoints();

    this.#clearBoard();

    if (this.#tripModel.isLoading()) {
      this.#renderLoading();
      return;
    }

    if (points.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderPointList();
    this.#renderPoints(points);
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#handleModeChange();

    if (this.#filterModel.getFilter() !== FilterType.EVERYTHING) {
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    } else if (this.#tripModel.getPoints().length === 0) {
      this.#clearBoard();
      this.#renderPointList();
    } else {
      this.init();
    }

    this.#pointNewPresenter.init();
  }

  #getPoints() {
    const filterType = this.#filterModel.getFilter();
    const points = [...filter[filterType](this.#tripModel.getPoints())];

    switch (this.#currentSortType) {
      case SortType.TIME:
        return points.sort(sortPointByTime);
      case SortType.PRICE:
        return points.sort(sortPointByPrice);
      case SortType.DAY:
      default:
        return points.sort(sortPointByDay);
    }
  }

  #getSorts() {
    return this.#tripModel.getSorts().map((sort) => ({
      ...sort,
      isChecked: sort.type === this.#currentSortType,
    }));
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      sorts: this.#getSorts(),
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#tripEventsContainer);
  }

  #renderPointList() {
    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    this.#pointNewPresenter = new PointNewPresenter({
      tripEventsListElement: this.#tripEventsListComponent.element,
      destinations: this.#tripModel.getDestinations(),
      offers: this.#tripModel.getOffers(),
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointFormClose,
    });
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyListView({
      filterType: this.#filterModel.getFilter(),
    });

    render(this.#emptyListComponent, this.#tripEventsContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripEventsContainer);
  }

  #renderPoints(points) {
    const destinations = this.#tripModel.getDestinations();
    const offers = this.#tripModel.getOffers();
    const tripEventsListElement = this.#tripEventsListComponent.element;

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        tripEventsListElement,
        destinations,
        offers,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange,
      });

      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearBoard() {
    const isNewPointFormOpen = this.#pointNewPresenter?.isActive();

    this.#pointNewPresenter?.destroy({isSilent: true});
    if (isNewPointFormOpen) {
      this.#handleNewPointDestroy();
    }
    this.#pointNewPresenter = null;
    this.#clearPointList();
    remove(this.#sortComponent);
    remove(this.#emptyListComponent);
    remove(this.#loadingComponent);
    remove(this.#tripEventsListComponent);

    this.#sortComponent = null;
    this.#emptyListComponent = null;
    this.#loadingComponent = new LoadingView();
    this.#tripEventsListComponent = new ListView();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.init();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          await this.#tripModel.updatePoint(updateType, update);
          break;
        case UserAction.ADD_POINT:
          await this.#tripModel.addPoint(updateType, update);
          break;
        case UserAction.DELETE_POINT:
          await this.#tripModel.deletePoint(updateType, update);
          break;
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MAJOR) {
      this.#currentSortType = SortType.DAY;
    }

    this.init();
  };

  #handleNewPointFormClose = () => {
    this.#handleNewPointDestroy();
    this.init();
  };
}

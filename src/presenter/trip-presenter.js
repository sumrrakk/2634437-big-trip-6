import {render} from '../framework/render.js';
import FilterView from '../view/filter.js';
import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import EmptyListView from '../view/empty-list.js';
import PointPresenter from './point-presenter.js';
import {generateFilter} from '../mock/filter.js';
import {SortType} from '../const.js';

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
  #currentSortType = SortType.DAY;

  constructor({filterContainer, tripEventsContainer, tripModel}) {
    this.filterContainer = filterContainer;
    this.tripEventsContainer = tripEventsContainer;
    this.tripModel = tripModel;
    this.tripEventsListComponent = new ListView();
  }

  init() {
    const points = this.#getPoints();
    const filters = generateFilter(points);
    const sorts = this.#getSorts();

    render(new FilterView({filters}), this.filterContainer);

    if (points.length === 0) {
      render(new EmptyListView(), this.tripEventsContainer);
      return;
    }

    render(new SortView({
      sorts,
      onSortTypeChange: this.#handleSortTypeChange,
    }), this.tripEventsContainer);
    render(this.tripEventsListComponent, this.tripEventsContainer);

    this.#renderPoints(points);
  }

  #getPoints() {
    const points = [...this.tripModel.getPoints()];

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
    return this.tripModel.getSorts().map((sort) => ({
      ...sort,
      isChecked: sort.type === this.#currentSortType,
    }));
  }

  #renderPoints(points) {
    const destinations = this.tripModel.getDestinations();
    const offers = this.tripModel.getOffers();
    const tripEventsListElement = this.tripEventsListComponent.element;

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        tripEventsListElement,
        destinations,
        offers,
        onDataChange: this.#handlePointChange,
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

  #handlePointChange = (updatedPoint) => {
    this.tripModel.updatePoint(updatedPoint);
    this.#clearPointList();
    this.#renderPoints(this.#getPoints());
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints(this.#getPoints());
  };
}

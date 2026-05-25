import {render} from '../framework/render.js';
import FilterView from '../view/filter.js';
import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import EmptyListView from '../view/empty-list.js';
import PointPresenter from './point-presenter.js';
import {generateFilter} from '../mock/filter.js';

export default class TripPresenter {
  #pointPresenters = new Map();

  constructor({filterContainer, tripEventsContainer, tripModel}) {
    this.filterContainer = filterContainer;
    this.tripEventsContainer = tripEventsContainer;
    this.tripModel = tripModel;
    this.tripEventsListComponent = new ListView();
  }

  init() {
    const points = this.tripModel.getPoints();
    const destinations = this.tripModel.getDestinations();
    const offers = this.tripModel.getOffers();
    const filters = generateFilter(points);
    const sorts = this.tripModel.getSorts();

    render(new FilterView({filters}), this.filterContainer);

    if (points.length === 0) {
      render(new EmptyListView(), this.tripEventsContainer);
      return;
    }

    render(new SortView({sorts}), this.tripEventsContainer);
    render(this.tripEventsListComponent, this.tripEventsContainer);

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

  #handlePointChange = (updatedPoint) => {
    this.tripModel.updatePoint(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}

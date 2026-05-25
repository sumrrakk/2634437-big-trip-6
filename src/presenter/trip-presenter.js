import {render, replace} from '../framework/render.js';
import FilterView from '../view/filter.js';
import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import EmptyListView from '../view/empty-list.js';
import PointView from '../view/point.js';
import PointEditView from '../view/point-edit.js';
import {generateFilter} from '../mock/filter.js';

export default class TripPresenter {
  #currentOpenFormCloseHandler = null;

  constructor({filterContainer, tripEventsContainer, tripModel}) {
    this.filterContainer = filterContainer;
    this.tripEventsContainer = tripEventsContainer;
    this.tripModel = tripModel;
    this.tripEventsListComponent = new ListView();
  }

  getPointDestination(point) {
    return this.tripModel.getDestinations().find((destination) => destination.id === point.destination);
  }

  getPointOffers(point) {
    return this.tripModel
      .getOffers()
      .filter((offer) => offer.type === point.type && point.offers.includes(offer.id));
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
      this.#renderPoint(point, destinations, offers, tripEventsListElement);
    });
  }

  #renderPoint(point, destinations, offers, tripEventsListElement) {
    let pointComponent = null;
    let pointEditComponent = null;

    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
      if (this.#currentOpenFormCloseHandler === replaceFormToPoint) {
        this.#currentOpenFormCloseHandler = null;
      }
    };

    const replacePointToForm = () => {
      this.#currentOpenFormCloseHandler?.();
      replace(pointEditComponent, pointComponent);
      document.addEventListener('keydown', escKeyDownHandler);
      this.#currentOpenFormCloseHandler = replaceFormToPoint;
    };

    function escKeyDownHandler(evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
      }
    }

    pointComponent = new PointView({
      point,
      destination: this.getPointDestination(point),
      offers: this.getPointOffers(point),
      onEditClick: () => {
        replacePointToForm();
      },
    });

    pointEditComponent = new PointEditView({
      point,
      destinations,
      offers,
      onFormSubmit: () => {
        replaceFormToPoint();
      },
      onRollupClick: () => {
        replaceFormToPoint();
      },
    });

    render(pointComponent, tripEventsListElement);
  }
}

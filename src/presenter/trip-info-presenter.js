import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info.js';

export default class TripInfoPresenter {
  #tripMainContainer = null;
  #tripModel = null;
  #tripInfoComponent = null;

  constructor({tripMainContainer, tripModel}) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripModel = tripModel;

    this.#tripModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#tripModel.getPoints();
    const prevTripInfoComponent = this.#tripInfoComponent;

    if (points.length === 0 || this.#tripModel.isLoading()) {
      remove(prevTripInfoComponent);
      this.#tripInfoComponent = null;
      return;
    }

    this.#tripInfoComponent = new TripInfoView({
      points,
      destinations: this.#tripModel.getDestinations(),
      offers: this.#tripModel.getOffers(),
    });

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}

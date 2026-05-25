import Observable from '../framework/observable.js';
import {SORTS, UpdateType} from '../const.js';

export default class TripModel extends Observable {
  #tripApiService = null;
  #isLoading = true;

  constructor({tripApiService}) {
    super();
    this.#tripApiService = tripApiService;
    this.points = [];
    this.destinations = [];
    this.offers = [];
    this.sorts = SORTS;
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#tripApiService.points,
        this.#tripApiService.destinations,
        this.#tripApiService.offers,
      ]);

      this.points = points;
      this.destinations = destinations;
      this.offers = offers;
    } catch {
      this.points = [];
      this.destinations = [];
      this.offers = [];
    }

    this.#isLoading = false;
    this._notify(UpdateType.INIT);
  }

  getPoints() {
    return this.points;
  }

  setPoints(updateType, points) {
    this.points = points;
    this._notify(updateType);
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getSorts() {
    return this.sorts;
  }

  isLoading() {
    return this.#isLoading;
  }

  async updatePoint(updateType, update) {
    const index = this.points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    const updatedPoint = await this.#tripApiService.updatePoint(update);

    this.points = [
      ...this.points.slice(0, index),
      updatedPoint,
      ...this.points.slice(index + 1),
    ];
    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, update) {
    this.points = [
      update,
      ...this.points,
    ];
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.points = [
      ...this.points.slice(0, index),
      ...this.points.slice(index + 1),
    ];
    this._notify(updateType);
  }
}

import {getDestinations, getOffers, getPoints} from '../mock/point.js';
import {getSorts} from '../mock/sort.js';
import Observable from '../framework/observable.js';

export default class TripModel extends Observable {
  constructor() {
    super();
    this.points = getPoints();
    this.destinations = getDestinations();
    this.offers = getOffers();
    this.sorts = getSorts();
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

  updatePoint(updateType, update) {
    const index = this.points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.points = [
      ...this.points.slice(0, index),
      update,
      ...this.points.slice(index + 1),
    ];
    this._notify(updateType, update);
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

import {getDestinations, getOffers, getPoints} from '../mock/point.js';
import {getSorts} from '../mock/sort.js';

export default class TripModel {
  constructor() {
    this.points = getPoints();
    this.destinations = getDestinations();
    this.offers = getOffers();
    this.sorts = getSorts();
  }

  getPoints() {
    return this.points;
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

  updatePoint(update) {
    const index = this.points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.points = [
      ...this.points.slice(0, index),
      update,
      ...this.points.slice(index + 1),
    ];
  }
}

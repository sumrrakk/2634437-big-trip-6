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
}

import AbstractView from '../framework/view/abstract-view.js';
import {getTripCost, getTripDates, getTripTitle} from '../utils/trip-info.js';

function createTripInfoTemplate(points, destinations, offers) {
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripTitle(points, destinations)}</h1>
      <p class="trip-info__dates">${getTripDates(points)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripCost(points, offers)}</span>
    </p>
  </section>`;
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}

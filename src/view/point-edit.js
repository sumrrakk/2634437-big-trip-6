import {EVENT_TYPES} from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {capitalize, formatEditDate} from '../utils/point.js';

const DEFAULT_POINT_TYPE = 'flight';

const BLANK_POINT = {
  basePrice: '',
  dateFrom: '',
  dateTo: '',
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_POINT_TYPE,
};

function createEventTypeItemTemplate(type, selectedType, idSuffix) {
  return `<div class="event__type-item">
    <input id="event-type-${type}-${idSuffix}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === selectedType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${idSuffix}">${capitalize(type)}</label>
  </div>`;
}

function createDestinationOptionTemplate(destination) {
  return `<option value="${destination.name}"></option>`;
}

function createOfferTemplate(offer, selectedOffers, idSuffix) {
  const isChecked = selectedOffers.includes(offer.id);

  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-${idSuffix}" type="checkbox" name="event-offer-${offer.id}" ${isChecked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.id}-${idSuffix}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
}

function createOffersSectionTemplate(offers, selectedOffers, idSuffix) {
  if (offers.length === 0) {
    return '';
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offers.map((offer) => createOfferTemplate(offer, selectedOffers, idSuffix)).join('')}
    </div>
  </section>`;
}

function createPhotoTemplate(picture) {
  return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
}

function createDestinationSectionTemplate(destination) {
  if (!destination) {
    return '';
  }

  const photosTemplate = destination.pictures.length > 0
    ? `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures.map((picture) => createPhotoTemplate(picture)).join('')}
      </div>
    </div>`
    : '';

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    ${photosTemplate}
  </section>`;
}

function createPointEditTemplate(point, destinations, offers, isNewPoint) {
  const currentPoint = {...BLANK_POINT, ...point};
  const {basePrice, dateFrom, dateTo, destination: destinationId, offers: selectedOffers, type} = currentPoint;
  const idSuffix = isNewPoint ? 'new' : currentPoint.id;
  const destination = destinations.find((item) => item.id === destinationId);
  const destinationName = destination ? destination.name : '';
  const currentOffers = offers.filter((offer) => offer.type === type);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${idSuffix}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${idSuffix}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${EVENT_TYPES.map((eventType) => createEventTypeItemTemplate(eventType, type, idSuffix)).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${idSuffix}">${capitalize(type)}</label>
          <input class="event__input  event__input--destination" id="event-destination-${idSuffix}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${idSuffix}">
          <datalist id="destination-list-${idSuffix}">
            ${destinations.map((item) => createDestinationOptionTemplate(item)).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${idSuffix}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${idSuffix}" type="text" name="event-start-time" value="${dateFrom ? formatEditDate(dateFrom) : ''}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${idSuffix}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${idSuffix}" type="text" name="event-end-time" value="${dateTo ? formatEditDate(dateTo) : ''}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${idSuffix}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${idSuffix}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
        ${isNewPoint ? '' : `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>
      <section class="event__details">
        ${createOffersSectionTemplate(currentOffers, selectedOffers, idSuffix)}
        ${createDestinationSectionTemplate(destination)}
      </section>
    </form>
  </li>`;
}

export default class PointEditView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #isNewPoint = false;
  #handleFormSubmit = null;
  #handleRollupClick = null;

  constructor({point = {}, destinations, offers, isNewPoint = false, onFormSubmit = () => {}, onRollupClick = () => {}}) {
    super();
    this._state = PointEditView.parsePointToState(point);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#isNewPoint = isNewPoint;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#destinations, this.#offers, this.#isNewPoint);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
  }

  static parsePointToState(point) {
    return {...BLANK_POINT, ...point};
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    this.updateElement({
      destination: selectedDestination?.id ?? null,
    });
  };
}

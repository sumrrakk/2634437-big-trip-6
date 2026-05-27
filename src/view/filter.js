import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const FILTER_NAME = {
  everything: 'Everything',
  future: 'Future',
  present: 'Present',
  past: 'Past',
};

function createFilterItemTemplate(filter, isChecked) {
  const {type, count} = filter;

  return `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked ? 'checked' : ''} ${type !== FilterType.EVERYTHING && count === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${FILTER_NAME[type]}</label>
  </div>`;
}

function createFilterTemplate(filters, currentFilterType) {
  return `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterItemTemplate(filter, filter.type === currentFilterType)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.disabled) {
      return;
    }

    this.#handleFilterTypeChange(evt.target.value);
  };
}

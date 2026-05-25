import AbstractView from '../framework/view/abstract-view.js';

function createSortItemTemplate(sort) {
  const {type, name, isChecked, isDisabled} = sort;

  return `<div class="trip-sort__item  trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="trip-sort__btn" for="sort-${type}">${name}</label>
  </div>`;
}

function createSortTemplate(sorts) {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sorts.map((sort) => createSortItemTemplate(sort)).join('')}
  </form>`;
}

export default class SortView extends AbstractView {
  #sorts = null;

  constructor({sorts}) {
    super();
    this.#sorts = sorts;
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }
}

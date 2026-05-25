import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const EMPTY_LIST_MESSAGE = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createEmptyListTemplate(filterType) {
  return `<p class="trip-events__msg">${EMPTY_LIST_MESSAGE[filterType]}</p>`;
}

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}

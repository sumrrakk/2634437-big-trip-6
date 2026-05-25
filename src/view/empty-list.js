import AbstractView from '../framework/view/abstract-view.js';

const EMPTY_LIST_MESSAGE = 'Click New Event to create your first point';

function createEmptyListTemplate() {
  return `<p class="trip-events__msg">${EMPTY_LIST_MESSAGE}</p>`;
}

export default class EmptyListView extends AbstractView {
  get template() {
    return createEmptyListTemplate();
  }
}

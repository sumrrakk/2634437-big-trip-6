import {render, remove, RenderPosition} from '../framework/render.js';
import PointNewView from '../view/point-new.js';
import {UpdateType, UserAction} from '../const.js';

export default class PointNewPresenter {
  #tripEventsListElement = null;
  #destinations = null;
  #offers = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointNewComponent = null;

  constructor({tripEventsListElement, destinations, offers, onDataChange, onDestroy}) {
    this.#tripEventsListElement = tripEventsListElement;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointNewComponent !== null) {
      return;
    }

    this.#pointNewComponent = new PointNewView({
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick,
    });

    render(this.#pointNewComponent, this.#tripEventsListElement, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  isActive() {
    return this.#pointNewComponent !== null;
  }

  destroy({isSilent = false} = {}) {
    if (this.#pointNewComponent === null) {
      return;
    }

    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    if (!isSilent) {
      this.#handleDestroy();
    }
  }

  #handleFormSubmit = async (point) => {
    this.#pointNewComponent.setSaving();

    try {
      await this.#handleDataChange(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point,
      );
      this.destroy({isSilent: true});
      this.#handleDestroy();
    } catch {
      this.#pointNewComponent.setAborting();
    }
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

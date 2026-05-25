import PointEditView from './point-edit.js';

export default class PointNewView extends PointEditView {
  constructor({destinations, offers, onFormSubmit, onCancelClick}) {
    super({
      destinations,
      offers,
      isNewPoint: true,
      onFormSubmit,
      onDeleteClick: onCancelClick,
    });
  }
}

import ApiService from './framework/api-service.js';

function adaptToClient(point) {
  return {
    id: point.id,
    basePrice: point.base_price,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    destination: point.destination,
    isFavorite: point.is_favorite,
    offers: point.offers,
    type: point.type,
  };
}

function adaptToServer(point) {
  const adaptedPoint = {
    'base_price': point.basePrice,
    'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : point.dateFrom,
    'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : point.dateTo,
    destination: point.destination,
    'is_favorite': point.isFavorite,
    offers: point.offers,
    type: point.type,
  };

  if (point.id !== undefined) {
    adaptedPoint.id = point.id;
  }

  return adaptedPoint;
}

function adaptOffersToClient(offersByType) {
  return offersByType.flatMap((offerGroup) => offerGroup.offers.map((offer) => ({
    ...offer,
    type: offerGroup.type,
  })));
}

export default class TripApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse)
      .then((points) => points.map(adaptToClient));
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse)
      .then(adaptOffersToClient);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedPoint = await ApiService.parseResponse(response);

    return adaptToClient(parsedPoint);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedPoint = await ApiService.parseResponse(response);

    return adaptToClient(parsedPoint);
  }

  async deletePoint(point) {
    await this._load({
      url: `points/${point.id}`,
      method: 'DELETE',
    });
  }
}

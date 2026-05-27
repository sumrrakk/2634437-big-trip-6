import {formatInfoDate} from './point.js';

const MAX_DESTINATIONS_COUNT = 3;

function getSortedPoints(points) {
  return [...points].sort((pointA, pointB) => new Date(pointA.dateFrom) - new Date(pointB.dateFrom));
}

function getTripTitle(points, destinations) {
  const sortedPoints = getSortedPoints(points);
  const destinationNames = sortedPoints.map((point) => destinations.find((destination) => destination.id === point.destination)?.name);
  const existingDestinationNames = destinationNames.filter(Boolean);

  if (existingDestinationNames.length === 0) {
    return '';
  }

  if (existingDestinationNames.length > MAX_DESTINATIONS_COUNT) {
    return `${existingDestinationNames[0]} &mdash; ... &mdash; ${existingDestinationNames.at(-1)}`;
  }

  return existingDestinationNames.join(' &mdash; ');
}

function getTripDates(points) {
  const sortedPoints = getSortedPoints(points);
  const firstPoint = sortedPoints[0];
  const lastPoint = sortedPoints.at(-1);

  if (!firstPoint || !lastPoint) {
    return '';
  }

  return `${formatInfoDate(firstPoint.dateFrom)}&nbsp;&mdash;&nbsp;${formatInfoDate(lastPoint.dateTo)}`;
}

function getTripCost(points, offers) {
  return points.reduce((cost, point) => {
    const selectedOffersCost = offers
      .filter((offer) => point.offers.includes(offer.id))
      .reduce((offersCost, offer) => offersCost + offer.price, 0);

    return cost + point.basePrice + selectedOffersCost;
  }, 0);
}

export {getTripTitle, getTripDates, getTripCost};

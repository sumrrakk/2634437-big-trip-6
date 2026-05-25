import {FilterType} from '../const.js';
import {isPointFuture, isPointPast, isPointPresent} from '../utils/point.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

function generateFilter(points) {
  return Object.entries(filter).map(([filterType, filterPoints]) => ({
    type: filterType,
    count: filterPoints(points).length,
  }));
}

export {filter, generateFilter};

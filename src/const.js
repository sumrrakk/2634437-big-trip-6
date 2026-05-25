const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

export {EVENT_TYPES, FilterType, SortType};

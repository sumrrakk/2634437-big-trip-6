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

const SORTS = [
  {
    type: SortType.DAY,
    name: 'Day',
    isChecked: true,
    isDisabled: false,
  },
  {
    type: SortType.EVENT,
    name: 'Event',
    isChecked: false,
    isDisabled: true,
  },
  {
    type: SortType.TIME,
    name: 'Time',
    isChecked: false,
    isDisabled: false,
  },
  {
    type: SortType.PRICE,
    name: 'Price',
    isChecked: false,
    isDisabled: false,
  },
  {
    type: SortType.OFFER,
    name: 'Offers',
    isChecked: false,
    isDisabled: true,
  },
];

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {EVENT_TYPES, FilterType, SortType, SORTS, UserAction, UpdateType};

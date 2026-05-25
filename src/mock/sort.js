import {SortType} from '../const.js';

const sorts = [
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

function getSorts() {
  return sorts;
}

export {getSorts};

import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import TripApiService from './trip-api-service.js';

const AUTHORIZATION = `Basic ${Math.random().toString(36).slice(2)}`;
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripMainContainer = document.querySelector('.trip-main');
const tripEventsContainer = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');
const tripModel = new TripModel({
  tripApiService: new TripApiService(END_POINT, AUTHORIZATION),
});
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  tripEventsContainer,
  tripModel,
  filterModel,
  onNewPointDestroy: () => {
    newEventButton.disabled = false;
  },
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  tripModel,
});

const tripInfoPresenter = new TripInfoPresenter({
  tripMainContainer,
  tripModel,
});

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();
tripModel.init().finally(() => {
  newEventButton.disabled = tripModel.getDestinations().length === 0;
});

newEventButton.addEventListener('click', () => {
  tripPresenter.createPoint();
  newEventButton.disabled = true;
});

import {getRandomInteger} from '../utils/random.js';

const TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Transport',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const TYPE_TITLES = [
  'Order Uber',
  'Add luggage',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
];

const generateSingleOffer = () => {
  return {
    title: TYPE_TITLES[getRandomInteger(0, TYPE_TITLES.length - 1)],
    price: getRandomInteger(30, 500),
  };
};

const generateOfferList = () => {
  const OFFERS = [];
  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    OFFERS.push(generateSingleOffer());
  }
  return OFFERS;
};

const getFullOffer = () => {
  return {
    type: TYPES[getRandomInteger(0, TYPES.length - 1)],
    offers: generateOfferList(),
  };
};

export const getOffers = () => {
  return new Array(20)
    .fill()
    .map(getFullOffer);
};

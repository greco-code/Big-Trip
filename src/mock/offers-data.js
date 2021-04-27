import {getRandomInteger} from '../utils/random.js';

export const TYPES = [
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

const getFullOffer = (index) => {
  return {
    type: TYPES[index],
    offers: generateOfferList(),
  };
};

const getOffers = () => {
  const offersList = [];

  TYPES.forEach((type, index) => {
    offersList.push(getFullOffer(index));
  });

  return offersList;
};

export const offersArray = getOffers();

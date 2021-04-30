import {getRandomInteger, shuffleArray} from '../utils/random.js';

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

const TYPES_PRICE = [
  {
    title: 'Order Uber',
    price: 100,
  },
  {
    title: 'Add luggage',
    price: 100,
  },
  {
    title: 'Add breakfast',
    price: 100,
  },
  {
    title: 'Book tickets',
    price: 100,
  },
  {
    title: 'Rent a car',
    price: 100,
  },
];

const getFullOffer = (index) => {
  return {
    type: TYPES[index],
    offers: shuffleArray(TYPES_PRICE).slice(0, getRandomInteger(0, 5)),
  };
};

const getOffers = () => {
  const offersList = [];

  TYPES.forEach((type, index) => {
    offersList.push(getFullOffer(index));
  });

  return offersList;
};

export const offers = getOffers();

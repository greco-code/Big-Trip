import {getRandomInteger} from '../utils/random.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {destinations} from './destinations-data.js';
import {offers} from './offers-data.js';

const EVENT_MIN_PRICE = 20;
const EVENT_MAX_PRICE = 1000;

// Возвращает рандомную цену, округленную до 10
const generatePrice = (min, max) => {
  const value = getRandomInteger(min, max);
  return Math.round(value / 10) * 10;
};

// Генерирует рандомную дату не далее 10 дней от сегодняшней
const generateDateFrom = () => {
  const randomDate = getRandomInteger(1, 10);
  return dayjs().add(randomDate, 'day');
};

// Добавляет не более пяти часов от стартовой даты
const generateDateTo = (dateFrom) => {
  return dayjs(dateFrom)
    .add(getRandomInteger(0, 5), 'hour')
    .add(getRandomInteger(1, 59), 'minute');
};


export const generateEvent = () => {
  const dateFrom = generateDateFrom().toDate();
  const dateTo = generateDateTo(dateFrom).toDate();
  const destination = destinations[getRandomInteger(0, destinations.length - 1)];
  const offersList = offers[getRandomInteger(0, offers.length - 1)];

  return {
    base_price: generatePrice(EVENT_MIN_PRICE, EVENT_MAX_PRICE),
    date_from: dateFrom,
    date_to: dateTo,
    destination,
    id: nanoid(),
    is_favorite: Boolean(getRandomInteger(0, 1)),
    offers: offersList.offers,
    type: offersList.type,
  };
};

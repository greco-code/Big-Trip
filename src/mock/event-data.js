import {getRandomInteger, shuffleArray, randomizeArray} from '../util.js';
import dayjs from 'dayjs';


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

const DESTINATION_INFO = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const INFO_LENGTH = 5;

// Возвращает рандомный текст из предложений в DESTINATION_INFO
const generateInfo = () => {
  const randomInteger = getRandomInteger(0, INFO_LENGTH);
  return shuffleArray(DESTINATION_INFO).slice(0, randomInteger).join();
};

const DESTINATION = {
  'Amsterdam': generateInfo(),
  'Chamonix': generateInfo(),
  'Geneva': generateInfo(),
  'Italy': generateInfo(),
  'Spain': generateInfo(),
};

const OFFERS = [
  {
    title: 'Order Uber',
    price: 20,
  },
  {
    title: 'Add luggage',
    price: 50,
  },
  {
    title: 'Rent a car',
    price: 200,
  },
  {
    title: 'Add breakfast',
    price: 50,
  },
  {
    title: 'Book tickets',
    price: 40,
  },
];

// Возвращает массив из 5 неповторяющихся чисел
const generateRandomIntArray = () => {
  const randomIntSet = new Set();

  while (randomIntSet.size < PHOTOS_MAX_LENGTH) {
    randomIntSet.add(getRandomInteger(0, 1000000));
  }
  return Array.from(randomIntSet);
};

const PHOTOS = [];

const EVENT_MIN_PRICE = 20;
const EVENT_MAX_PRICE = 1000;
const PHOTOS_MAX_LENGTH = 5;


const randomizeType = () => {
  return TYPES[getRandomInteger(0, TYPES.length - 1)];
};

const randomizePointName = () => {
  const keys = Object.keys(DESTINATION);

  return keys[getRandomInteger(0, keys.length - 1)];
};

// Возвращает массив из сгенерированных ссылок на фото
const generatePhotos = () => {
  const photosCurrentLength = getRandomInteger(0, PHOTOS_MAX_LENGTH - 1);

  for (let i = 0; i < photosCurrentLength; i++) {
    const randomNumber = generateRandomIntArray()[getRandomInteger(0, generateRandomIntArray().length - 1)];

    const PHOTOS_LINK = `http://picsum.photos/248/152?r=${randomNumber}`;
    PHOTOS.push(PHOTOS_LINK);
  }

  return shuffleArray(PHOTOS).slice(0, getRandomInteger(0, PHOTOS_MAX_LENGTH));
};

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

  // console.log(dayjs(dateFrom).format('D MMMM'));

  const getDuration = () => {
    const MILLISECONDS = 1000;
    const MINUTES = 60;
    const HOURS = 60;

    const diffTime = Math.abs(dateTo - dateFrom); //ms
    const diffHours = Math.floor(diffTime / (MILLISECONDS * MINUTES * HOURS)); //hours
    let diffMinutes = Math.ceil(diffTime / (MILLISECONDS * MINUTES)); //minutes

    // Выводит количество минут в часовом формате (менее 60 минут)
    if (diffMinutes > 59) {
      const moreHours = Math.floor(diffMinutes / 60);
      diffMinutes = diffMinutes - moreHours * 60;
    }

    // Если разница менее одного часа
    if (diffHours < 1) {
      return (`${diffMinutes}M`);
    }

    return (`${diffHours}H ${diffMinutes}M`);
  };

  const duration = getDuration();
  const name = randomizePointName();
  const description = DESTINATION[name];

  return {
    base_price: generatePrice(EVENT_MIN_PRICE, EVENT_MAX_PRICE),
    date_from: dateFrom,
    date_to: dateTo,
    duration,
    destination: {
      name,
      description,
      pictures: [
        {
          src: generatePhotos(),
          description,
        },
      ],
    },
    id: '0',
    is_favorite: Boolean(getRandomInteger(0, 1)),
    offers: randomizeArray(OFFERS),
    type: randomizeType(),
  };
};

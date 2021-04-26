import {generateRandomIntArray, getRandomInteger, shuffleArray} from '../utils/random.js';

const INFO_LENGTH = 5;
const PHOTOS_MAX_LENGTH = 5;

const DESTINATION_NAMES = [
  'Amsterdam', 'Rome', 'Singapore', 'Los-Angeles', 'Moscow',
  'Paris', 'London', 'Sydney', 'Tokyo', 'Zurich',
  'Prague', 'Minsk', 'Milan', 'New-York', 'Bangkok',
  'Vienna', 'Baku', 'Brussels', 'Sofia', 'Ottawa',
];

const DESTINATION_DESCRIPTIONS = [
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

// Возвращает рандомный текст из предложений в DESTINATION_INFO
const generateInfo = () => {
  const randomInteger = getRandomInteger(0, INFO_LENGTH);
  return shuffleArray(DESTINATION_DESCRIPTIONS).slice(0, randomInteger).join();
};

// Возвращает рандомное количество объектов с ссылкой и описанием на фото
const generatePhotos = () => {
  const PHOTOS = [];
  const photosCurrentLength = getRandomInteger(0, PHOTOS_MAX_LENGTH - 1);
  const randomNumbers = generateRandomIntArray(PHOTOS_MAX_LENGTH);

  for (let i = 0; i < photosCurrentLength; i++) {
    const randomNumber = randomNumbers[i];
    PHOTOS.push({
      src: `http://picsum.photos/248/152?r=${randomNumber}`,
      description: `Подпись к картинке номер ${i + 1}`,
    });
  }

  return PHOTOS;
};

const getDestination = () => {
  return {
    description: generateInfo(),
    name: DESTINATION_NAMES[getRandomInteger(0, DESTINATION_NAMES.length - 1)],
    pictures: generatePhotos(),
  };
};

export const getDestinations = () => {
  return new Array(20)
    .fill()
    .map(getDestination);
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 Utils
 */
export const shuffleArray = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const generateRandomIntArray = (amount) => {
  const randomIntSet = new Set();

  while (randomIntSet.size < amount) {
    randomIntSet.add(getRandomInteger(0, 1000000));
  }
  return Array.from(randomIntSet);
};

// Рандомно добавляет элементы в массив
export const randomizeArray = (arr) => arr.filter(() => Math.random() > 0.5);

export const replaceSpace = (str) => str.replace(/\s+/g, '_');

export const isEmpty = (obj) => [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length;

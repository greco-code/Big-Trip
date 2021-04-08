import dayjs from 'dayjs';

// Возвращает рандомное целое число в заданном диапазоне
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// Перемешивает массив
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

// Возвращает массив из неповторяющихся рандомных чисел
export const generateRandomIntArray = (amount) => {
  const randomIntSet = new Set();

  while (randomIntSet.size < amount) {
    randomIntSet.add(getRandomInteger(0, 1000000));
  }
  return Array.from(randomIntSet);
};

// Рандомно добавляет элементы в массив
export const randomizeArray = (arr) => {
  return arr.filter(() => Math.random() > 0.5);
};

// Время
export const humanizeEventDueTime = (dueTime) => {
  return dayjs(dueTime).format('HH:mm');
};

export const humanizeEventDueDate = (dueDate) => {
  return dayjs(dueDate).format('MMM DD');
};

export const humanizeEventDueFullDate = (dueDate) => {
  return dayjs(dueDate).format('YY/MM/DD HH:mm');
};


export const randomObject = (obj) => {
  const keys = Object.keys(obj);
  return obj[keys[ keys.length * Math.random() << 0]];
};

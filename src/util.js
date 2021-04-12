import dayjs from 'dayjs';

/**
 Render
 */
export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// Возвращает рандомное целое число в заданном диапазоне
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
export const randomizeArray = (arr) => {
  return arr.filter(() => Math.random() > 0.5);
};

/**
 Time
 */
export const humanizeToTime = (dueTime) => {
  return dayjs(dueTime).format('HH:mm');
};

export const humanizeToMonthDay = (dueDate) => {
  return dayjs(dueDate).format('MMM DD');
};

export const humanizeToFullDate = (dueDate) => {
  return dayjs(dueDate).format('YY/MM/DD HH:mm');
};

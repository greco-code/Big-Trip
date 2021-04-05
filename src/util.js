import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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

export const randomizeArray = (arr) => {
  return arr.filter(() => Math.random() > 0.5);
};

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

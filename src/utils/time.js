import dayjs from 'dayjs';

const MILLISECONDS = 1000;
const MINUTES = 60;
const HOURS = 60;

export const humanizeToTime = (dueTime) => {
  return dayjs(dueTime).format('HH:mm');
};

export const humanizeToMonthDay = (dueDate) => {
  return dayjs(dueDate).format('MMM DD');
};

export const humanizeToFullDate = (dueDate) => {
  return dayjs(dueDate).format('DD/MM/YY HH:mm');
};

export const humanizeToDuration = (dueDate) => {
  return dayjs(dueDate).format('DD HH MM');
};

export const getDuration = (dateFrom, dateTo) => {
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

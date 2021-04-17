import dayjs from 'dayjs';

export const humanizeToTime = (dueTime) => {
  return dayjs(dueTime).format('HH:mm');
};

export const humanizeToMonthDay = (dueDate) => {
  return dayjs(dueDate).format('MMM DD');
};

export const humanizeToFullDate = (dueDate) => {
  return dayjs(dueDate).format('YY/MM/DD HH:mm');
};

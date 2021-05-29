import {FilterType} from '../const';
import dayjs from 'dayjs';

const nowDate = dayjs();

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.PAST]: (events) => events.filter((event) => event.dateTo < nowDate),
  [FilterType.FUTURE]: (events) => events.filter((event) => event.dateTo > nowDate),
};

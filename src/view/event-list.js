import Abstract from './abstract.js';

export const createTripEventsListTemplate = () => {
  return `<ul class="trip-events__list">
         </ul>`;
};


export default class EventList extends Abstract{
  getTemplate() {
    return createTripEventsListTemplate();
  }
}

import Abstract from './abstract.js';

export const createEventItemContainerTemplate = () => {
  return `<li class="trip-events__item">
          </li>`;
};

export default class EventListItem extends Abstract{
  getTemplate() {
    return createEventItemContainerTemplate();
  }
}

import Abstract from './abstract.js';

const createNoEventTemplate = () => {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};

export default class NoEvent extends Abstract {
  getTemplate() {
    return createNoEventTemplate();
  }
}

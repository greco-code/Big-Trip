import AbstractView from './abstract.js';

const createLoader = () => {
  return `<p class="trip-events__msg">
            Loading...
          </p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createLoader();
  }
}

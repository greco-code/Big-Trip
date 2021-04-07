export const createEventPhotosContainer = (event) => {
  const {pictures} = event.destination;

  return `<div class="event__photos-container">
                      <div class="event__photos-tape">
                        <img class="event__photo" src="${pictures.src}" alt="${pictures.description}">
                        <img class="event__photo" src="${pictures.src}" alt="${pictures.description}">
                        <img class="event__photo" src="${pictures.src}" alt="${pictures.description}">
                        <img class="event__photo" src="${pictures.src}" alt="${pictures.description}">
                        <img class="event__photo" src="${pictures.src}" alt="${pictures.description}">
                      </div>
                    </div>`;
};

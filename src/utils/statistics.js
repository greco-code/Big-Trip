const MILLISECONDS = 1000;
const MINUTES = 60;
const HOURS = 60;
const DAYS = 24;

export const makeItemsUniq = (items) => [...new Set(items)];

export const getCostByType = (events, type) => {
  const eventsByType = events.filter((tripEvent) => tripEvent.type === type);
  return eventsByType.reduce((sum, item) => sum + item.base_price, 0);
};

export const getTypeAmount = (events, type) => {
  return events.filter((event) => event.type === type).length;
};

export const getTimeSpend = (events, type) => {
  const allTripEventsTypes = events.filter((tripEvent) => tripEvent.type === type);
  return allTripEventsTypes.reduce((totalDuration, tripEvent) => {
    return totalDuration + (tripEvent.date_to - tripEvent.date_from);
  }, 0);
};

export const formatDuration = (diffTime) => {
  let diffHours = Math.floor(diffTime / (MILLISECONDS * MINUTES * HOURS)); //hours
  let diffMinutes = Math.ceil(diffTime / (MILLISECONDS * MINUTES)); //minutes
  const diffDays = Math.floor(diffTime / (MILLISECONDS * MINUTES * HOURS * DAYS));

  if (diffMinutes > 59) {
    const moreHours = Math.floor(diffMinutes / 60);
    diffMinutes = diffMinutes - moreHours * 60;
  }

  // Если разница менее одного часа
  if (diffHours < 1) {
    return (`${diffMinutes}M`);
  }

  // Если разница более одного дня
  if (diffDays > 0) {
    diffHours = diffHours -  diffDays * 24;
    return `(${diffDays}D ${diffHours}H ${diffMinutes}M)`;
  }

  return (`${diffHours}H ${diffMinutes}M`);
};

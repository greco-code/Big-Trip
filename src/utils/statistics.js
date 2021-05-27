const MILLISECONDS = 1000;
const MINUTES = 60;
const HOURS = 60;
const DAYS = 24;

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
    return `${diffMinutes}M`;
  }

  // Если разница более одного дня
  if (diffDays > 0) {
    diffHours = diffHours -  diffDays * 24;
    return `${diffDays}D ${diffHours}H ${diffMinutes}M`;
  }

  return `${diffHours}H ${diffMinutes}M`;
};

export const sortMapByValues = (mapToSort) => {
  return new Map([...mapToSort.entries()]
    .sort((firstEntry, secondEntry) => {
      return secondEntry[1] - firstEntry[1];
    }));
};

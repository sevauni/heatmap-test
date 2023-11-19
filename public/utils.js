export function getGradientColorHex(currentValue, maxValue) {
  const ratio = currentValue / maxValue;

  const startColor = [244, 244, 244]; 
  const endColor = [255, 0, 0]; 

  const interpolatedColor = startColor.map((channel, i) =>
    Math.round(channel + ratio * (endColor[i] - channel))
  );

  const hexColor = interpolatedColor
    .map((channel) => {
      const hex = channel.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

  return `#${hexColor.toUpperCase()}`;
}

export function getHourLabel(segmentIndex, segmentsPerDay) {
  const hours = segmentIndex * (24 / segmentsPerDay);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours} ${ampm}`;
}

export function chooseColor(currentValue, maxValue) {
  const colors = [
    "#f4f4f4",
    "#66adfa",
    "#ffbe2e",
    "#9acc34",
    "#ffa22f",
    "#f23b3b",
  ];

  const colorIndex = Math.floor((currentValue / maxValue) * colors.length);

  return colors[colorIndex];
}

export function getDayOfWeek(dayIndex) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysOfWeek[dayIndex];
}

export function generateFrequencyArray(dates, segmentsPerDay) {
  const daysOfWeek = 7;
  let maxValue = 0;
  const result = Array.from({ length: daysOfWeek }, () =>
    Array(segmentsPerDay).fill(0)
  );

  dates.forEach((stringDate) => {
    const date = new Date(stringDate);

    const dayOfWeek = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const segmentIndex = Math.floor(
      totalMinutes / ((24 * 60) / segmentsPerDay)
    );

    maxValue = Math.max(maxValue, result[dayOfWeek][segmentIndex]);
    result[dayOfWeek][segmentIndex]++;
  });

  return { result, maxValue };
}

export default {
  getGradientColorHex,
  getHourLabel,
  chooseColor,
  getDayOfWeek,
  generateFrequencyArray,
};

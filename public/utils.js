import * as dayjs from "dayjs";

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
  const colorRanges = [
    { color: "#f4f4f4", percentage: 0 },
    { color: "#c7e1fd", percentage: 2 },
    { color: "#ffbe2e", percentage: 38 },
    { color: "#9acc34", percentage: 45 },
    { color: "#ffa22f", percentage: 50 },
    { color: "#f23b3b", percentage: 60 },
  ];

  let color = colorRanges[colorRanges.length - 1].color; //fallback color
  const percentage = (currentValue / maxValue) * 100;

  for (const range of colorRanges) {
    if (percentage <= range.percentage) {
      color = range.color;
      break;
    }
  }

  return color;
}

export function getDayOfWeek(dayIndex) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return daysOfWeek[dayIndex];
}

/**
 * Generates a frequency array based on the provided dates and segments per day.
 *
 * @param {string[]} dates - Array of date strings.
 * @param {number} segmentsPerDay - Number of segments to divide each day.
 * @returns {{result: Array<Array<string[]>>, maxValue: number}} - Object containing the result array and the maximum value.
 */
export function generateFrequencyArray(dates, segmentsPerDay) {
  const daysOfWeek = 7;
  let maxValue = 0;

  const result = Array.from({ length: daysOfWeek }, () =>
    Array(segmentsPerDay).fill([])
  );

  dates
    .map((date) => dayjs(date))

    .forEach((dateObj) => {
      const currentDay = (dateObj.day() + 6) % 7;
      // 6 is not a magic number
      // The expression dateObj.day() + 6) % 7 returns the day of the week of the dateObj date,
      // shifted by 6 so that Sunday becomes 6, Monday becomes 0, Tuesday becomes 1, and so on.

      const segmentIndex = getSegmentNumber(segmentsPerDay, dateObj);
      const currentValue = result[currentDay][segmentIndex];
      maxValue = Math.max(maxValue, currentValue.length);

      result[currentDay][segmentIndex] = [
        ...currentValue,
        dateObj.format("HH:mm DD/MM/YYYY dddd") + "\n",
      ];
    });

  return { result, maxValue };
}

/**
 * Calculates the segment number for a given date based on the specified amount of parts per day.
 *
 * @param {number} amountOfParts - Number of parts to divide each day.
 * @param {dayjs.Dayjs} dateObj - dayjs object representing the date.
 * @returns {number} - The calculated segment number for the given date.
 */
function getSegmentNumber(amountOfParts, dateObj) {
  const hoursInSegment = 24 / amountOfParts;
  const hourOfDay = dateObj.hour();
  return Math.floor(hourOfDay / hoursInSegment);
}

export default {
  getGradientColorHex,
  getHourLabel,
  chooseColor,
  getDayOfWeek,
  generateFrequencyArray,
};

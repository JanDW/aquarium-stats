// @ts-check
const { DateTime } = require('luxon');

const FISH_DATA_PROPERTIES = [
  'prime',
  'waterChange',
  'stability',
  'co2',
  'bakingSoda',
  'replacedFilter',
  'crushedCoral',
  'fertilizer',
  'spongeClean'
];

const FIRST_DAY_OF_WEEK = 1;
const LAST_DAY_OF_WEEK = 7;

const now = DateTime.local();
const currentMonth = now.month;
const yearCurrentMonth = now.year;
const { previousMonth, yearPreviousMonth } = getPreviousMonthAndYear(
  currentMonth,
  yearCurrentMonth
);

/**
 * Calculates the previous month and year based on the current month and year.
 *
 * @param {number} currentMonth - The current month (1-12).
 * @param {number} yearCurrentMonth - The year of the current month (e.g., 2022).
 * @returns {Object} An object containing the previous month and its year.
 * @returns {number} .previousMonth - The previous month (1-12).
 * @returns {number} .yearPreviousMonth - The year of the previous month.
 */

function getPreviousMonthAndYear(currentMonth, yearCurrentMonth) {
  const previousDate = DateTime.local(yearCurrentMonth, currentMonth).minus({
    months: 1,
  });
  return {
    previousMonth: previousDate.month,
    yearPreviousMonth: previousDate.year,
  };
}

/**
 * Retrieves specific fish data for a given day.
 *
 * @param {Array} fishData - An array of fish data objects.
 * @param {Object} day - An object representing the day, must have an 'isoString' property.
 * @returns {Object} An object containing the fish data for the given day. The object's properties are defined by the FISH_DATA_PROPERTIES constant. If no data is found for the given day, the properties will be set to null.
 */

function getFishDataForDay(fishData, day) {
  const fishDataForDay = fishData.find((task) => task.date === day.isoString);
  return Object.fromEntries(
    FISH_DATA_PROPERTIES.map((property) => [
      property,
      fishDataForDay?.[property] ?? null,
    ])
  );
}

/**
 * Adds fish data to each day in the calendar data.
 *
 * @param {Object} calendarData - An object representing the calendar data. Must have a 'days' property that is an array of day objects.
 * @param {Array} fishData - An array of fish data objects.
 * @returns {Object} A new object representing the calendar data, with fish data added to each day.
 */

function addFishDataToCalendar(calendarData, fishData) {
  return {
    ...calendarData,
    days: calendarData.days.map((day) => ({
      ...day,
      ...getFishDataForDay(fishData, day),
    })),
  };
}

/**
 * Generates an array of days for a given month and year.
 *
 * @param {number} month - The month for which to generate the days (1-12).
 * @param {number} year - The year for which to generate the days.
 * @returns {Object} An object containing the generated days and additional information.
 * @property {string} monthHumanReadable - The full name of the month.
 * @property {number} year - The year for which the days were generated.
 * @property {Array} days - An array of day objects. Each object has a 'day' property (the day of the month, zero-padded to two digits), an 'isoString' property (the date in ISO 8601 format), and a 'dayOfWeek' property (the full name of the day of the week).
 * @property {number} daysToSkip - The number of days to skip at the start of the month to align the first day of the month with the correct day of the week.
 * @property {number} daysToAppend - The number of days to append at the end of the month to align the last day of the month with the correct day of the week.
 */

function getDaysInMonth(month, year) {
  const days = [];
  const monthDate = DateTime.local(year, month);
  const daysInMonth = monthDate.daysInMonth;
  const monthHumanReadable = monthDate.monthLong;
  let daysToSkip, daysToAppend;
  for (let i = 1; i <= daysInMonth; i++) {
    const date = DateTime.local(year, month, i);
    if (i === 1) {
      daysToSkip = date.weekday - FIRST_DAY_OF_WEEK;
    }
    if (i === daysInMonth) {
      daysToAppend = LAST_DAY_OF_WEEK - date.weekday;
    }
    const day = {
      day: String(date.day).padStart(2, '0'),
      isoString: date.toISODate(),
      dayOfWeek: date.weekdayLong,
    };
    days.push(day);
  }
  return { monthHumanReadable, year, days, daysToSkip, daysToAppend };
}

/**
 * Retrieves the most recent non-null data for each specified key from the provided data array.
 *
 * @param {Array<Object>} data - The data array to retrieve data from. Each object in the array should have a 'date' property and properties for each of the specified keys.
 * @param {...string} keys - The keys to retrieve data for.
 * @returns {Object} An object where each key is one of the specified keys and each value is an object containing the most recent non-null value for that key and the date of that value.
 */

function getRecentData(data, ...keys) {
  const recentData = {};

  for (const key of keys) {
    const filteredData = data.filter(item => item[key] !== null);
    filteredData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (filteredData.length > 0) {
      recentData[key] = {
        value: filteredData[0][key],
        date: filteredData[0].date,
      };
    }
  }

  return recentData;
}


module.exports = {
  eleventyComputed: {
    bettaCalendarData(data) {
      const fishData = data.fishData;
      
      const daysInCurrentMonth = getDaysInMonth(currentMonth, yearCurrentMonth);
      const currentMonthCalendarData = addFishDataToCalendar(
        daysInCurrentMonth,
        fishData
      );
      const daysInPreviousMonth = getDaysInMonth(
        previousMonth,
        yearPreviousMonth
      );
      const previousMonthCalendarData = addFishDataToCalendar(
        daysInPreviousMonth,
        fishData
      );

      return [currentMonthCalendarData, previousMonthCalendarData];
    },
    bettaRecentData(data) {
      const fishData = data.fishData;
      const recentData = getRecentData(fishData, 'ammonia', 'nitrites', 'nitrates', 'tds', 'ph', 'gh', 'kh', 'chlorine');
      return recentData;
    },
  }
};
const { DateTime } = require('luxon');

const DATA_PROPERTIES = [
  'prime',
  'waterChange',
  'stability',
  'co2',
  'bakingSoda',
  'cleanedFilter',
  'crushedCoral',
  'fertilizer',
  'spongeClean',
  'culture',
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

function getPreviousMonthAndYear(currentMonth, yearCurrentMonth) {
  const previousDate = DateTime.local(yearCurrentMonth, currentMonth).minus({
    months: 1,
  });
  return {
    previousMonth: previousDate.month,
    yearPreviousMonth: previousDate.year,
  };
}

function getDataForDay(data, day) {
  const dataForDay = data.find((task) => task.date === day.isoString);
  return Object.fromEntries(
    DATA_PROPERTIES.map((property) => [
      property,
      dataForDay?.[property] ?? null,
    ])
  );
}

function addDataToCalendar(calendarData, data) {
  return {
    ...calendarData,
    days: calendarData.days.map((day) => ({
      ...day,
      ...getDataForDay(data, day),
    })),
  };
}

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
    const filteredData = data.filter((item) => item[key] !== null);
    filteredData.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (filteredData.length > 0) {
      recentData[key] = {
        value: filteredData[0][key],
        date: filteredData[0].date,
        permalink: filteredData[0].permalink,
      };
    }
  }

  return recentData;
}

module.exports = {
  eleventyComputed: {
    twoGallonCalendarData(data) {
      const twoGallonData = data.twoGallonData;

      const daysInCurrentMonth = getDaysInMonth(currentMonth, yearCurrentMonth);
      const currentMonthCalendarData = addDataToCalendar(
        daysInCurrentMonth,
        twoGallonData
      );
      const daysInPreviousMonth = getDaysInMonth(
        previousMonth,
        yearPreviousMonth
      );
      const previousMonthCalendarData = addDataToCalendar(
        daysInPreviousMonth,
        twoGallonData
      );

      return [currentMonthCalendarData, previousMonthCalendarData];
    },
    twoGallonRecentData(data) {
      const twoGallonData = data.twoGallonData;
      //  for RecentData macro
      const recentData = getRecentData(
        twoGallonData,
        'ammonia',
        'nitrites',
        'nitrates',
        'tds',
        'ph',
        'gh',
        'kh',
        'chlorine'
      );
      return recentData;
    },
  },
};

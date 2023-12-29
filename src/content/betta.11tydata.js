const { DateTime } = require('luxon');

const now = DateTime.local();
const oneMonthAgo = now.minus({ months: 1 });
const currentMonth = now.month;
const yearCurrentMonth = now.year;
const { previousMonth, yearPreviousMonth } = getPreviousMonthAndYear(
  currentMonth,
  yearCurrentMonth
);

/*
"prime": null,
"waterChange": null,
"stability": false,
"co2": true,
"bakingSoda": false,
"replacedFilter": false,
"crushedCoral": false,
"fertilizer": false
*/

/**
 * Returns the previous month and year for a given month and year.
 *
 * @param {number} month - The current month as a number from 1 (January) to 12 (December).
 * @param {number} year - The current year as a four-digit number.
 * @returns {Object} An object with properties `previousMonth` and `yearPreviousMonth`.
 */

function getPreviousMonthAndYear(month, year) {
  let previousMonth, yearPreviousMonth;
  if (month === 1) {
    previousMonth = 12;
    yearPreviousMonth = year - 1;
  } else {
    previousMonth = month - 1;
    yearPreviousMonth = year;
  }
  return { previousMonth, yearPreviousMonth };
}

// Convert current month to alphanumeric string in title case
const currentMonthString = now.monthLong;
const previousMonthString = oneMonthAgo.monthLong;

/**
 * Returns an array of objects for each day in the specified month and year.
 * Each object contains the ISO date string and the name of the day of the week.
 *
 * @param {number} month - The month as a number from 1 (January) to 12 (December).
 * @param {number} year - The year as a four-digit number.
 * @returns {Object[]} An array of objects for each day in the month.
 *
 * @example
 * // Returns for December 2023
 * getDaysInMonth(12, 2023);
 * // Output:
 * [
 *   { isoString: '2023-12-01', dayOfWeek: 'Friday' },
 *   { isoString: '2023-12-02', dayOfWeek: 'Saturday' },
 *   // ... more days ...
 *   { isoString: '2023-12-30', dayOfWeek: 'Saturday' },
 *   { isoString: '2023-12-31', dayOfWeek: 'Sunday' }
 * ]
 */

function getDaysInMonth(month, year) {
  const days = [];
  const daysInMonth = DateTime.local(year, month).daysInMonth;
  let daysToSkip, daysToAppend;
  for (let i = 1; i <= daysInMonth; i++) {
    const date = DateTime.local(year, month, i);
    if (i === 1) {
      daysToSkip = date.weekday - 1;
    }
    if (i === daysInMonth) {
      daysToAppend = 7 - date.weekday;
    }
    const day = {
      day: String(date.day).padStart(2, '0'),
      isoString: date.toISODate(),
      dayOfWeek: date.weekdayLong,
    };
    days.push(day);
  }
  return { days, daysToSkip, daysToAppend };
}

function addFishDataToCalendar(days, fishData) {
  const calendar = days.map((day) => {
    const fishDataForDay = fishData.filter(
      (fish) => fish.date === day.isoString
    );
    return {
      ...day,
      prime: fishDataForDay[0]?.prime ?? null,
      waterChange: fishDataForDay[0]?.waterChange ?? null,
      stability: fishDataForDay[0]?.stability ?? null,
      co2: fishDataForDay[0]?.co2 ?? null,
      bakingSoda: fishDataForDay[0]?.bakingSoda ?? null,
      replacedFilter: fishDataForDay[0]?.replacedFilter ?? null,
      crushedCoral: fishDataForDay[0]?.crushedCoral ?? null,
      fertilizer: fishDataForDay[0]?.fertilizer ?? null,
    };
  });
  return calendar;
}

const {
  days: currentMonthDays,
  daysToSkip: currentMonthDaysToSkip,
  daysToAppend: currentMonthDaysToAppend,
} = getDaysInMonth(currentMonth, yearCurrentMonth);
const {
  days: previousMonthDays,
  daysToSkip: previousMonthDaysToSkip,
  daysToAppend: previousMonthDaysToAppend,
} = getDaysInMonth(previousMonth, yearPreviousMonth);

const calendar = {
  currentMonth: {
    daysToSkip: currentMonthDaysToSkip,
    daysToAppend: currentMonthDaysToAppend,
    month: currentMonthString,
    days: currentMonthDays,
  },
  previousMonth: {
    daysToSkip: previousMonthDaysToSkip,
    daysToAppend: previousMonthDaysToAppend,
    month: previousMonthString,
    days: previousMonthDays,
  },
};

module.exports = {
  eleventyComputed: {
    calendarData(data) {
      // console.log(data.fishData)
      const fishData = data.fishData;
      const calendarWithFishData = {
        currentMonth: {
          ...calendar.currentMonth,
          days: addFishDataToCalendar(currentMonthDays, fishData),
        },
        previousMonth: {
          ...calendar.previousMonth,
          days: addFishDataToCalendar(previousMonthDays, fishData),
        },
      };
      console.log(calendarWithFishData.currentMonth.days);
    },
  },
};

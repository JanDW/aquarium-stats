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


function getFishDataForDay(fishData, day) {
  const fishDataForDay = fishData.find((fish) => fish.date === day.isoString);
  return Object.fromEntries(
    FISH_DATA_PROPERTIES.map((property) => [
      property,
      fishDataForDay?.[property] ?? null,
    ])
  );
}

function addFishDataToCalendar(calendarData, fishData) {
  return calendarData.days.map((day) => ({
    ...day,
    ...getFishDataForDay(fishData, day),
  }));
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

module.exports = {
  eleventyComputed: {
    calendarData(data) {
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
  },
};

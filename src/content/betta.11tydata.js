const { DateTime } = require('luxon');

const now = DateTime.local();
const currentMonth = now.month;
const yearCurrentMonth = now.year;

function getPreviousMonthAndYear(currentMonth, yearCurrentMonth) {
  const previousDate = DateTime.local(yearCurrentMonth, currentMonth).minus({
    months: 1,
  });
  return {
    previousMonth: previousDate.month,
    yearPreviousMonth: previousDate.year,
  };
}

const { previousMonth, yearPreviousMonth } = getPreviousMonthAndYear(
  currentMonth,
  yearCurrentMonth
);

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

function getFishDataForDay(fishData, day) {
  const fishDataForDay = fishData.find((fish) => fish.date === day.isoString);
  return FISH_DATA_PROPERTIES.reduce((acc, property) => {
    acc[property] = fishDataForDay?.[property] ?? null;
    return acc;
  }, {});
}

function addFishDataToCalendar(calendarData, fishData) {
  return calendarData.days.map((day) => ({
    ...day,
    ...getFishDataForDay(fishData, day),
  }));
}

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
  return { month, year, days, daysToSkip, daysToAppend };
}

module.exports = {
  eleventyComputed: {
    calendarData(data) {
      const fishData = data.fishData;
      const currentMonthDays = getDaysInMonth(currentMonth, yearCurrentMonth);
      const currentMonthCalendarData = addFishDataToCalendar(
        currentMonthDays,
        fishData
      );
      const previousMonthDays = getDaysInMonth(
        previousMonth,
        yearPreviousMonth
      );
      const previousMonthCalendarData = addFishDataToCalendar(
        previousMonthDays,
        fishData
      );

      return [currentMonthCalendarData, previousMonthCalendarData];
    },
  },
};

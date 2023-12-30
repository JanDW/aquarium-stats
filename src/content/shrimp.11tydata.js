const { DateTime } = require('luxon');

const DATA_PROPERTIES = [
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

module.exports = {
  eleventyComputed: {
    shrimpCalendarData(data) {
      const shrimpData = data.shrimpData;
      
      const daysInCurrentMonth = getDaysInMonth(currentMonth, yearCurrentMonth);
      const currentMonthCalendarData = addDataToCalendar(
        daysInCurrentMonth,
        shrimpData
      );
      const daysInPreviousMonth = getDaysInMonth(
        previousMonth,
        yearPreviousMonth
      );
      const previousMonthCalendarData = addDataToCalendar(
        daysInPreviousMonth,
        shrimpData
      );

      return [currentMonthCalendarData, previousMonthCalendarData];
    },
  },
};
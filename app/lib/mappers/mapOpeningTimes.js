const DAYS_OF_WEEK = 's:daysOfWeek';
const DAY_OF_WEEK = 's:dayOfWeek';
const DAY_NAME = 's:dayName';
const TIMES_SESSION = 's:timesSession';
const TIMES_SESSIONS = 's:timesSessions';
const FROM_TIME = 's:fromTime';
const TO_TIME = 's:toTime';

function getSession(session) {
  return {
    opens: session[FROM_TIME],
    closes: session[TO_TIME],
  };
}

function getSessions(session) {
  const timesSessions = session[TIMES_SESSION];
  if (!timesSessions || timesSessions === 'Closed') {
    return [];
  }
  if (timesSessions.constructor === Array) {
    return timesSessions.map(getSession);
  }
  return [
    getSession(timesSessions),
  ];
}

function dayValid(dayOfWeek) {
  return dayOfWeek && dayOfWeek[DAY_NAME] && dayOfWeek[TIMES_SESSIONS];
}

function mapDaysOfWeek(rawTimes) {
  const daysOfWeek = rawTimes[DAYS_OF_WEEK][DAY_OF_WEEK];
  const openingTimes = {};

  daysOfWeek.forEach((dayOfWeek) => {
    if (dayValid(dayOfWeek)) {
      const dayName = dayOfWeek[DAY_NAME].toLowerCase();
      openingTimes[dayName] = getSessions(dayOfWeek[TIMES_SESSIONS]);
    }
  });

  return openingTimes;
}

function openingTimeValid(rawTimes) {
  return rawTimes && rawTimes[DAYS_OF_WEEK] &&
         rawTimes[DAYS_OF_WEEK][DAY_OF_WEEK];
}

function mapOpeningTimes(rawTimes) {
  return openingTimeValid(rawTimes) ? mapDaysOfWeek(rawTimes) : undefined;
}

module.exports = mapOpeningTimes;

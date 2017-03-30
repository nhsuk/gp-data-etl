const utils = require('../utils');

const SESSION_TYPES = 'timesSessionTypes';
const SESSION_TYPE = 'timesSessionType';
const DAYS_OF_WEEK = 'daysOfWeek';
const DAY_OF_WEEK = 'dayOfWeek';
const DAY_NAME = 'dayName';
const TIMES_SESSION = 'timesSession';
const TIMES_SESSIONS = 'timesSessions';
const FROM_TIME = 'fromTime';
const TO_TIME = 'toTime';

function getSessionType(sessions, type) {
  // eslint-disable-next-line arrow-body-style
  return sessions.find((session) => {
    return session && session.$ && session.$.sessionType === type;
  });
}

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
  return utils.asArray(timesSessions).map(getSession);
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

function sessionTypesValid(openingTimes) {
  return openingTimes && openingTimes[SESSION_TYPES] &&
         openingTimes[SESSION_TYPES][SESSION_TYPE];
}

function createAll(openingTimes) {
  const sessions = openingTimes[SESSION_TYPES][SESSION_TYPE];
  return {
    reception: mapOpeningTimes(getSessionType(sessions, 'reception')),
    surgery: mapOpeningTimes(getSessionType(sessions, 'surgery')),
  };
}

function mapAllOpeningTimes(openingTimes) {
  return sessionTypesValid(openingTimes) ? createAll(openingTimes) : undefined;
}

module.exports = {
  all: mapAllOpeningTimes,
  one: mapOpeningTimes,
};

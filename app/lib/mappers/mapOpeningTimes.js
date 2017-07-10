const utils = require('../utils/utils');

function getSessionType(sessions, type) {
  // eslint-disable-next-line arrow-body-style
  return sessions.find((session) => {
    return utils.getAttribute(session, 'sessionType') === type;
  });
}

function getSession(session) {
  return {
    opens: session.fromTime,
    closes: session.toTime,
  };
}

function getSessions(session) {
  const timesSessions = session.timesSession;
  if (!timesSessions || timesSessions === 'Closed') {
    return [];
  }
  return utils.asArray(timesSessions).map(getSession);
}

function dayValid(dayOfWeek) {
  return dayOfWeek && dayOfWeek.dayName && dayOfWeek.timesSessions;
}

function mapDate(alterations, day) {
  if (day.date && day.timesSessions) {
    // eslint-disable-next-line no-param-reassign
    alterations[day.date] = getSessions(day.timesSessions);
  }
  return alterations;
}

function mapDates(rawTimes) {
  // eslint-disable-next-line arrow-body-style
  return utils.asArray(rawTimes.additionalDay).reduce(mapDate, {});
}

function mapDaysOfWeek(rawTimes) {
  const daysOfWeek = rawTimes.daysOfWeek.dayOfWeek;
  const openingTimes = {};

  daysOfWeek.forEach((dayOfWeek) => {
    if (dayValid(dayOfWeek)) {
      const dayName = dayOfWeek.dayName.toLowerCase();
      openingTimes[dayName] = getSessions(dayOfWeek.timesSessions);
    }
  });

  return openingTimes;
}

function dateValid(rawTimes) {
  return rawTimes && rawTimes.additionalDay;
}

function openingTimeValid(rawTimes) {
  return rawTimes && rawTimes.daysOfWeek &&
    rawTimes.daysOfWeek.dayOfWeek;
}

function mapOpeningTimes(rawTimes) {
  return openingTimeValid(rawTimes) ? mapDaysOfWeek(rawTimes) : undefined;
}

function mapAltOpeningTimes(rawTimes) {
  return dateValid(rawTimes) ? mapDates(rawTimes) : undefined;
}

function sessionTypesValid(openingTimes) {
  return openingTimes && openingTimes.timesSessionTypes &&
    openingTimes.timesSessionTypes.timesSessionType;
}

function createAll(openingTimes) {
  const sessions = openingTimes.timesSessionTypes.timesSessionType;
  return {
    reception: mapOpeningTimes(getSessionType(sessions, 'reception')),
    surgery: mapOpeningTimes(getSessionType(sessions, 'surgery')),
    alterations: mapAltOpeningTimes(getSessionType(sessions, 'additional')),
  };
}

function mapAllOpeningTimes(openingTimes) {
  return sessionTypesValid(openingTimes) ? createAll(openingTimes) : undefined;
}

module.exports = {
  all: mapAllOpeningTimes,
  one: mapOpeningTimes,
};

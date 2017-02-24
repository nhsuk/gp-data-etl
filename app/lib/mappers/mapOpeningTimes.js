function getSession(session) {
  return {
    opens: session['s:fromTime'],
    closes: session['s:toTime'],
  };
}

function getSessions(session) {
  const timesSessions = session['s:timesSession'];
  if (timesSessions.constructor === Array) {
    return timesSessions.map(getSession);
  }
  if (timesSessions === 'Closed') {
    return [];
  }
  return [
    getSession(timesSessions),
  ];
}

function mapOpeningTimes(rawTimes) {
  const openingTimes = {};
  rawTimes['s:daysOfWeek']['s:dayOfWeek'].forEach((dayOfWeek) => {
    openingTimes[dayOfWeek['s:dayName'].toLowerCase()] = getSessions(dayOfWeek['s:timesSessions']);
  });
  return openingTimes;
}

module.exports = mapOpeningTimes;

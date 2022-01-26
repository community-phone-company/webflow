function isWeekend() {
  const today = new Date().getDay();
  return (today == 6 || today == 0);
}

const schedule = (isWeekend()) ? '10am - 7pm ET Sat/Sun' : '7am - 10pm Mon-Fri';

$('#header-schedule').text(schedule);
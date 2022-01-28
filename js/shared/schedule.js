/*
* Dynamically change hours based on day
*/

const isWeekend = (() => {
    const today = new Date().getDay();
    return (today == 6 || today == 0);
})();

const scheduleHeader = document.getElementById("header-schedule");
const schedule = isWeekend ? '10am - 7pm ET Sat/Sun' : '7am - 10pm Mon-Fri';

if (scheduleHeader) {
    $(scheduleHeader).text(schedule);
}
//In minutes
let TIMER_VALUE = 50;
let CURRENT_TIMER_IN_SECS = TIMER_VALUE * 60;
const TIMER_VALUE_HTML_EL = document.querySelector("#timer_value");
const PLAY_PAUSE_BUTTON_EL = document.querySelector("#play_pause_btn");
const WEEK_TIME_EL = document.querySelector("#span_week_time");
const MONTH_TIME_EL = document.querySelector("#span_month_time");
const YEAR_TIME_EL = document.querySelector("#span_year_time");
let WEEK_TIME = 0;
let MONTH_TIME = 0;
let YEAR_TIME = 0;
let HAS_STARTED = false;
let TIMER = null;
const CURRENT_WEEK = getWeekOfYear(new Date());
const CURRENT_MONTH = new Date().getMonth().toString();

PLAY_PAUSE_BUTTON_EL.addEventListener("click", onPlayPauseHandler);
document
  .querySelector("#save_settings_btn")
  .addEventListener("click", saveSettings);

document
  .querySelector("#toggle_modal_btn")
  .addEventListener("click", loadSettings);

WEEK_TIME_EL.addEventListener("click", hackTime);

Notification.requestPermission();

/**
 * END SETUP
 *
 *
 *
 *
 */

prepareForNewCycle(true);

autoLoadWithGetParam();

function prepareForNewCycle(first_load = false) {
  onPlayPauseHandler({}, false);

  CURRENT_TIMER_IN_SECS = TIMER_VALUE * 60;

  if (!first_load) saveUserData();

  loadUserData();

  loadInterfaceElements();
}

function autoLoadWithGetParam() {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const timer_value = urlParams.get("timer_value");

  if (timer_value) {
    TIMER_VALUE = parseInt(timer_value);
    prepareForNewCycle();
  }
}

function onPlayPauseHandler(e, status = undefined) {
  HAS_STARTED = status === undefined ? !HAS_STARTED : status;
  if (HAS_STARTED) {
    TIMER = startTimer();
  } else {
    if (TIMER) {
      clearInterval(TIMER);
    }
  }

  document.querySelector("#play_pause_btn_label").innerHTML = HAS_STARTED
    ? "Pause"
    : "Play";
}

function saveUserData() {
  localStorage.setItem("timer_value", TIMER_VALUE);

  localStorage.setItem("week_time", WEEK_TIME);
  localStorage.setItem("month_time", MONTH_TIME);
  localStorage.setItem("year_time", YEAR_TIME);

  localStorage.setItem("user_week", CURRENT_WEEK);
  localStorage.setItem("user_month", CURRENT_MONTH);
}

function loadUserData() {
  const timer_value = localStorage.getItem("timer_value");

  if (timer_value) {
    TIMER_VALUE = parseInt(timer_value);
    CURRENT_TIMER_IN_SECS = TIMER_VALUE * 60;
  }

  const week_time = localStorage.getItem("week_time");
  const month_time = localStorage.getItem("month_time");
  const year_time = localStorage.getItem("year_time");

  WEEK_TIME = week_time ?? 0;
  MONTH_TIME = month_time ?? 0;
  YEAR_TIME = year_time ?? 0;

  const user_week = localStorage.getItem("user_week");

  if (user_week && CURRENT_WEEK !== user_week) {
    WEEK_TIME = 0;
  }

  const user_month = localStorage.getItem("user_month");

  if (user_month && CURRENT_MONTH !== user_month) {
    WEEK_TIME = 0;
  }
}

function loadInterfaceElements() {
  TIMER_VALUE_HTML_EL.innerHTML = getDisplaybleTimer(TIMER_VALUE);

  WEEK_TIME_EL.innerHTML = WEEK_TIME ? WEEK_TIME + "min" : "--";
  MONTH_TIME_EL.innerHTML = MONTH_TIME ? MONTH_TIME + "min" : "--";
  YEAR_TIME_EL.innerHTML = YEAR_TIME ? YEAR_TIME + "min" : "--";

  document.title = "task time";
}

function startTimer() {
  // Update the count down every 1 second

  var x = setInterval(function () {
    CURRENT_TIMER_IN_SECS--;

    // If the count down is finished, write some text
    if (CURRENT_TIMER_IN_SECS == 0) {
      showCongrats();
      collectTime();
      prepareForNewCycle();
    }

    const time_text = getDisplaybleTimer(
      parseInt(CURRENT_TIMER_IN_SECS / 60),
      CURRENT_TIMER_IN_SECS % 60
    );
    TIMER_VALUE_HTML_EL.innerHTML = time_text;
    document.title = time_text + " • task time";
  }, 1000);

  return x;
}

function collectTime() {
  WEEK_TIME = parseInt(TIMER_VALUE) + parseInt(WEEK_TIME);
  MONTH_TIME = parseInt(TIMER_VALUE) + parseInt(MONTH_TIME);
  YEAR_TIME = parseInt(TIMER_VALUE) + parseInt(YEAR_TIME);
}

function showCongrats() {
  const title = "Congrats!";
  const body = " +" + TIMER_VALUE + " minutes!";

  audioNotification();

  notify(title, body);
}

function audioNotification() {
  document.getElementById("alarm_audio").play();
}

function notify(title, body) {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification(title, {
      body,
      badge: "./badge.png",
      icon: "./countdown.png",
      silent: false,
      vibrate: true,
    });
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification(title, {
          body,
          badge: "./badge.png",
          icon: "./countdown.png",
          silent: false,
          vibrate: true,
        });
        // …
      }
    });
  }
}

function getDisplaybleTimer(m = null, s = null) {
  if (s) {
    if (s < 10) s = "0" + s;
  } else s = "00";

  if (m) {
    if (m < 10) m = "0" + m;
  } else m = "00";

  return m + ":" + s;
}

function hackTime() {
  let time = prompt("New time in minutes:");

  if (time === null || time === "" || isNaN(time)) return;

  WEEK_TIME = time;

  saveUserData();

  loadInterfaceElements();
}

function saveSettings() {
  const timer_value = document.querySelector("input[name='timer_value']").value;

  TIMER_VALUE = parseInt(timer_value);

  prepareForNewCycle();
}

function loadSettings() {
  document
    .querySelector("input[name='timer_value']")
    .setAttribute("value", TIMER_VALUE);
}

function getWeekOfYear(date) {
  const currentDate = typeof date === "object" ? date : new Date();
  const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
  const daysToNextMonday =
    januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
  const nextMonday = new Date(
    currentDate.getFullYear(),
    0,
    januaryFirst.getDate() + daysToNextMonday
  );

  return (
    currentDate < nextMonday
      ? 52
      : currentDate > nextMonday
      ? Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7)
      : 1
  ).toString();
}

console.log("v1.0.2");

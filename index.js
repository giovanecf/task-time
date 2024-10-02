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

PLAY_PAUSE_BUTTON_EL.addEventListener("click", onPlayPauseHandler);
document
  .querySelector("#save_settings_btn")
  .addEventListener("click", saveSettings);

document
  .querySelector("#toggle_modal_btn")
  .addEventListener("click", loadSettings);

WEEK_TIME_EL.addEventListener("click", hackTime);

function hackTime() {
  let time = prompt("New time in minutes:");

  WEEK_TIME = time;

  saveUserData();

  loadInterfaceElements();
}

function saveSettings() {
  const timer_value = document.querySelector("input[name='timer_value']").value;

  console.log(timer_value);

  TIMER_VALUE = parseInt(timer_value);

  saveUserData();

  loadInterfaceElements();
}

function loadSettings() {
  document
    .querySelector("input[name='timer_value']")
    .setAttribute("value", TIMER_VALUE);
}

function startTimer() {
  // Update the count down every 1 second
  var x = setInterval(function () {
    CURRENT_TIMER_IN_SECS--;

    // If the count down is finished, write some text
    if (CURRENT_TIMER_IN_SECS == 0) {
      onPlayPauseHandler();
      WEEK_TIME = parseInt(TIMER_VALUE) + parseInt(WEEK_TIME);
      saveUserData();
      loadInterfaceElements();
      alert("Congrats! +" + TIMER_VALUE + " minutes!");
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

function onPlayPauseHandler() {
  HAS_STARTED = !HAS_STARTED;
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

function saveTime() {}

function saveUserData() {
  localStorage.setItem("timer_value", TIMER_VALUE);

  localStorage.setItem("week_time", WEEK_TIME);
  localStorage.setItem("month_time", MONTH_TIME);
  localStorage.setItem("year_time", YEAR_TIME);
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
}

function loadInterfaceElements() {
  TIMER_VALUE_HTML_EL.innerHTML = getDisplaybleTimer(TIMER_VALUE);

  WEEK_TIME_EL.innerHTML = WEEK_TIME ? WEEK_TIME + "min" : "--";
  MONTH_TIME_EL.innerHTML = MONTH_TIME ? MONTH_TIME + "min" : "--";
  YEAR_TIME_EL.innerHTML = YEAR_TIME ? YEAR_TIME + "min" : "--";

  document.title = "task time";
}

function getDisplaybleTimer(m, s = null) {
  if (s) {
    if (s < 10) s = "0" + s;
  } else s = "00";

  if (m) {
    if (m < 10) m = "0" + m;
  } else m = "00";

  return m + ":" + s;
}

function autoLoadWithGetParam() {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const timer_value = urlParams.get("timer_value");

  if (timer_value) {
    TIMER_VALUE = parseInt(timer_value);
    loadInterfaceElements();
    onPlayPauseHandler();
  }
}

loadUserData();

loadInterfaceElements();

autoLoadWithGetParam();

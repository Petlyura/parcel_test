import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const dateTime = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const dataDays = document.querySelector('[data-days]');
const dataHours = document.querySelector('[data-hours]');
const dataMinutes = document.querySelector('[data-minutes]');
const dataSeconds = document.querySelector('[data-seconds]');

let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] > new Date()) {
      startBtn.disabled = false;
      Notiflix.Notify.success('Please press "START" to proceed');
      dateTime.dataset.time = selectedDates[0].getTime();
    } else {
      Notiflix.Notify.failure('Please choose a date in the future');
      startBtn.disabled = true;
    }
  },
};
flatpickr(dateTime, options);

function appUpdate() {
  timerId = setInterval(() => {
    startBtn.disabled = true;
    const currentTime = new Date().getTime();
    const chooseTime = Number(dateTime.dataset.time);
    let timeLeft = chooseTime - currentTime;

    const { days, hours, minutes, seconds } = convertMs(timeLeft);

    dataDays.innerHTML = String(days).length < 2 ? addLeadingZero(days) : days;
    dataHours.innerHTML =
      String(hours).length < 2 ? addLeadingZero(hours) : hours;
    dataMinutes.innerHTML =
      String(minutes).length < 2 ? addLeadingZero(minutes) : minutes;
    dataSeconds.innerHTML =
      String(seconds).length < 2 ? addLeadingZero(seconds) : seconds;
    if (timeLeft < 1000) {
      clearInterval(timerId);
      startBtn.disabled = false;
    }
  }, 1000);
}
function addLeadingZero(value) {
  const valueToString = String(value);
  return valueToString.padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startBtn.addEventListener('click', appUpdate);

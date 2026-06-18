import moment from 'moment';

function getTimerText(minutes = 0, seconds = 0) {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function initTimer(timer) {
  const minuteInput = timer.querySelector("[name='minutes']");
  const timeOutput = timer.querySelector('.time-output');
  timer.querySelector('.increase').addEventListener('click', () => {
    const minutes = Number.parseInt(minuteInput.value, 10);
    if (minutes >= 59) {
      return;
    }
    minuteInput.value = minutes + 1;
  });
  timer.querySelector('.decrease').addEventListener('click', () => {
    const minutes = Number.parseInt(minuteInput.value, 10);
    if (minutes <= 0) {
      return;
    }
    minuteInput.value = minutes - 1;
  });
  let intervalId;
  timer.querySelector('.start').addEventListener('click', (e) => {
    e.preventDefault();
    timer.classList.add('count');
    let leftSeconds = Number.parseInt(minuteInput.value, 10) * 60;
    timeOutput.innerText = getTimerText(minuteInput.value);
    leftSeconds -= 1;
    intervalId = setInterval(() => {
      if (leftSeconds < 0) {
        clearInterval(intervalId);
        return;
      }
      const duration = moment.duration(leftSeconds, 'seconds');
      timeOutput.innerText = getTimerText(duration.minutes(), duration.seconds());
      leftSeconds -= 1;
    }, 1000);
  });
  timer.querySelector('.reset').addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(intervalId);
    timer.classList.remove('count');
    timeOutput.innerText = getTimerText();
  });
}

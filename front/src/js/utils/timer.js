let timerInterval = null;

function formatTime(minutes, seconds) {
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

export function startTimer(selector) {
  if (timerInterval !== null) {
    return;
  }

  let seconds = 0;
  let minutes = 0;
  const timerElement = document.querySelector(selector);
  timerElement.textContent = formatTime(0, 0);

  timerInterval = setInterval(() => {
    seconds += 1;
    if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
    }
    timerElement.textContent = formatTime(minutes, seconds);
  }, 1000);
}

export function resetTimer(selector) {
  const timerElement = document.querySelector(selector);
  timerElement.textContent = formatTime(0, 0);
}

export function stopTimer(selector) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    resetTimer(selector);
  }
}

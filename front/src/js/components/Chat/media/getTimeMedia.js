let timerInterval;

export function startTimer() {
  let seconds = 0;
  let minutes = 0;

  const timerElement = document.getElementById('timer');
  timerElement.textContent = '00:00';

  timerInterval = setInterval(() => {
    seconds += 1;

    if (seconds === 60) {
      minutes += 1;
      seconds = 0;
    }

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
  }, 1000);
}

export function stopTimer() {
  clearInterval(timerInterval);
  const timerElement = document.getElementById('timer');
  timerElement.textContent = '00:00';
}

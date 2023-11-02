import { startTimer, stopTimer, resetTimer } from '../utils/timer';

const mockElement = {
  textContent: '',
};
document.querySelector = jest.fn().mockReturnValue(mockElement);

beforeAll(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
});

test('startTimer should start the timer', () => {
  startTimer('#timer');
  expect(mockElement.textContent).toBe('00:00');

  jest.advanceTimersByTime(1000);
  expect(mockElement.textContent).toBe('00:01');
});

test('stopTimer should stop the timer', () => {
  startTimer('#timer');
  jest.advanceTimersByTime(2000);
  stopTimer('#timer');

  expect(mockElement.textContent).toBe('00:00');
});

test('resetTimer should reset the timer to 00:00', () => {
  startTimer('#timer');
  jest.advanceTimersByTime(3000);
  resetTimer('#timer');

  expect(mockElement.textContent).toBe('00:00');
});

test('startTimer should not start a second timer if one is already running', () => {
  startTimer('#timer');
  jest.advanceTimersByTime(1000);
  startTimer('#timer');
  jest.advanceTimersByTime(1000);

  expect(mockElement.textContent).toBe('00:00');
});

afterAll(() => {
  jest.useRealTimers();
});

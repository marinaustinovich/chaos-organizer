const userId = 1;

const reminders = [
  {
    time: "2023-12-31T23:59:00",
    message: "New Year's Eve in one minute!",
    userId,
  },
  { time: "2024-01-01T00:00:00", message: "Happy New Year 2024!", userId },
  {
    time: "2023-11-15T12:00:00",
    message: "Take a break and have some tea ☕",
    userId,
  },
  { time: "2023-11-20T18:30:00", message: "Call a friend and chat", userId },
  {
    time: "2023-12-05T19:00:00",
    message: "Get ready for a visit from Santa Claus 🎅",
    userId,
  },
  {
    time: "2023-12-24T20:00:00",
    message: "Book a New Year's photo session 📸",
    userId,
  },
  {
    time: "2023-12-25T10:00:00",
    message: "Unwrap presents under the Christmas tree 🎁",
    userId,
  },
  {
    time: "2023-12-31T20:00:00",
    message: "Prepare for the New Year's party 🥳",
    userId,
  },
  {
    time: "2023-12-31T23:55:00",
    message: "Count your New Year's wishes ✨",
    userId,
  },
  {
    time: "2023-12-31T23:58:00",
    message: "Raise a glass of champagne 🍾",
    userId,
  },
  {
    time: "2023-12-31T23:59:30",
    message: "Get ready for the fireworks 🎆",
    userId,
  },
  {
    time: "2023-12-31T23:59:50",
    message: "Give yourself a smile 😃",
    userId,
  },
  { time: "2023-11-10T23:25:00", message: "😃", userId },
];

const defaultUser = {
  id: userId,
  name: "test",
  password: "test1test1",
  online: false,
  avatarURL: "http://localhost:7070/files/avatar.jpg",
};

const users = [defaultUser];

const audioExtensions = [
  "mp3",
  "wav",
  "ogg",
  "flac",
  "aac",
  "m4a",
  "aiff",
  "au",
  "wma",
  "alac",
  "amr",
];

const videoExtensions = [
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  "m4v",
  "mpg",
  "mpeg",
  "3gp",
  "f4v",
  "m2ts",
  "m4p",
  "mj2",
  "mts",
  "ogv",
  "qt",
  "vob",
];

module.exports = {
  audioExtensions,
  videoExtensions,
  reminders,
  users,
};

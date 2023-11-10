const WebSocket = require("ws");
const Reminder = require("../models/reminder");

const setLongTimeout = (callback, delay) => {
  const maxDelay = 2147483647;

  if (delay > maxDelay) {
    setTimeout(() => {
      setLongTimeout(callback, delay - maxDelay);
    }, maxDelay);
  } else {
    setTimeout(callback, delay);
  }
};

const setReminders = async (server, userId) => {
  const reminders = await Reminder.findAll({ where: { userId } });

  reminders.forEach((reminder) => activateReminder(server, reminder));
};

const activateReminder = (server, reminder) => {
  const scheduleTime = new Date(reminder.time).getTime();
  const currentTime = new Date().getTime();
  const delay = scheduleTime - currentTime;

  if (delay > 0) {
    setLongTimeout(async () => {
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'reminder',
            message: reminder.message
          }));
        }
      });

      try {
        await reminder.destroy();
        console.log(`Reminder with id ${reminder.id} was deleted successfully.`);
      } catch (deleteError) {
        console.error(`Failed to delete reminder with id ${reminder.id}:`, deleteError);
      }
    }, delay);
  }
}

module.exports = { setReminders, activateReminder };

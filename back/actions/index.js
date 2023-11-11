const addUser = require('./addUser');
const addMessage = require('./addMessage');
const deleteMessagesByUserId = require('./deleteMessagesByUserId');
const findUserMessages = require('./findUserMessages');
const moveFile = require('./moveFile');
const { setReminders, activateReminder } = require('./setReminders');

module.exports = {
  addUser,
  addMessage,
  deleteMessagesByUserId,
  findUserMessages,
  moveFile,
  setReminders,
  activateReminder
};
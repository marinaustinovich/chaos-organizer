const Message = require('../models/message');
const addMessage = async (userId, text, video, audio, location, file) => {
  try {
    console.log(`Message with user's id ${userId} has been added`);
    return await Message.create({
      userId,
      text,
      video,
      audio,
      location,
      file,
      date: Date.now(),
    });
  } catch (error) {
    console.error('Error adding message:', error);
  }
}
module.exports = addMessage;

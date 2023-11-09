const Message = require('../models/message');
const addMessage = async ({userId, text, video, audio, location, file}) => {
  console.log('create message', userId, text, video, audio, location, file )
  try {
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

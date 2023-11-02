const Message = require('../models/message');

const findUserMessages = async (userId) => {
  try {
    return await Message.findAll({
      where: { userId },
      order: [['date', 'ASC']],
      limit: 10,
    });
  } catch (error) {
    console.error('Error finding user messages:', error);
    return null;
  }
}
module.exports = findUserMessages;

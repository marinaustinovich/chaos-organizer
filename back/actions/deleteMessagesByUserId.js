const Message = require('../models/message');

const deleteMessagesByUserId = async (userId) => {
  try {
    await Message.destroy({ where: { userId } });
  } catch (error) {
    console.error('Error adding message:', error);
  }
}
module.exports = deleteMessagesByUserId;
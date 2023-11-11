const { Op } = require('sequelize');
const Message = require('../models/message');

const findUserMessages = async (options = {}) => {
  try {
    const { userId, lastMessageDate, text, file, video, audio, limit = 10 } = options;
    const whereClause = {};

    if (userId) {
      whereClause.userId = userId;
    }

    if (lastMessageDate) {
      whereClause.date = { [Op.lt]: new Date(lastMessageDate) };
    }

    if (text) {
      whereClause.text = { [Op.like]: `%${text}%` };
    }

    if (file) {
      whereClause.file = { [Op.ne]: null };
    }

    if (video) {
      whereClause.video = { [Op.ne]: null };
    }

    if (audio) {
      whereClause.audio = { [Op.ne]: null };
    }

    const messages = await Message.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit,
    });

    return messages.reverse();
  } catch (error) {
    console.error('Error finding user messages:', error);
    return [];
  }
};

module.exports = findUserMessages;

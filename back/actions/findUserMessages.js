const { Op } = require('sequelize');
const Message = require('../models/message');

const findUserMessages = async (userId, lastMessageDate = null, limit = 10) => {
  try {
    const whereClause = { userId };

    if (lastMessageDate) {
      whereClause.date = { [Op.lt]: new Date(lastMessageDate) };
    }

    const latestMessages = await Message.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit,
    });

    return latestMessages.reverse();
  } catch (error) {
    console.error('Error finding user messages:', error);
    return [];
  }
};

module.exports = findUserMessages;

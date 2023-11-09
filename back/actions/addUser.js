const User = require('../models/user');
const addUser = async (name, password) => {
  try {
    const user = await User.findOne({ where: { name } });
    if (user) {
      console.log(`User with name ${name} already exists`);
      return false;
    }

    console.log(`User with name ${name} has been added`);
    return await User.create({
      name,
      password,
      online: true,
      avatarURL: 'http://localhost:7070/img/avatar.jpg',
    });
  } catch (error) {
    console.error('Error adding user:', error);
  }
}
module.exports = addUser;

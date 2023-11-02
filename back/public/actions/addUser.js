const User = require('../models/user');
const addUser = async (name, password) => {
  try {
    // Проверка, существует ли пользователь с таким именем
    const user = await User.findOne({ where: { name } });
    if (user) {
      console.log(`User with name ${name} already exists`);
      return false;
    }

    // Если пользователь с таким именем не существует, то добавляем его в базу
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

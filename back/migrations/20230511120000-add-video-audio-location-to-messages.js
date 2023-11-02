module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Messages', 'video', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Messages', 'audio', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Messages', 'location', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Messages', 'video');
    await queryInterface.removeColumn('Messages', 'audio');
    await queryInterface.removeColumn('Messages', 'location');
  },
};

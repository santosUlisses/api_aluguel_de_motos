'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'tipo_usuario', {
      type: Sequelize.ENUM('admin', 'cliente'),
      allowNull: false,
      defaultValue: 'cliente'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'tipo_usuario');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('files', {
      fields: ['semina_id'],  // 제약 조건을 추가할 컬럼
      type: 'foreign key',
      name: 'fk_files_semina_id',  // 제약 조건 이름
      references: {
        table: 'seminas',  // 참조할 테이블 이름
        field: 'semina_id'   // 참조할 컬럼
      },
      onUpdate: 'cascade', // 참조하는 테이블에서 업데이트 시 어떻게 처리할지
      onDelete: 'cascade'  // 참조하는 테이블에서 삭제 시 어떻게 처리할지
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

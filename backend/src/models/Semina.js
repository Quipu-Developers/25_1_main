const { DataTypes } = require('sequelize');
const Sequelize = require("sequelize");
class Semina extends Sequelize.Model {
    static initiate(sequelize) {
        Semina.init(
            {
                semina_id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                }, // semina_id
                speaker_name: {
                    type: DataTypes.STRING,
                    allowNull: false
                }, // 발표자 이름
                speaker_major: {
                    type: DataTypes.STRING,
                    allowNull: false
                }, // 발표자 전공
                speaker_studentID: {
                    type: DataTypes.STRING,
                    allowNull: false,
                }, // 발표자 학번
                topic: {
                    type: DataTypes.STRING,
                    allowNUll: false,
                }, // 주제
                detail: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                }, // 내용
                presentation_date: {
                    type: DataTypes.DATE,
                    allowNULL: false,
                } // 발표 날짜
            },
            {
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: "Semina",
                tableName: "seminas",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {
      db.Semina.hasMany(db.Image, { foreignKey: 'semina_id', sourceKey: 'semina_id' });
    }
}

module.exports = Semina;

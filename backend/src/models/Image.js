const { DataTypes } = require('sequelize');
const Sequelize = require("sequelize");
class Image extends Sequelize.Model {
    static initiate(sequelize) {
        Image.init(
            {
                image_id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                }, // image_id
                image_url: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                semina_id: {
                  type: DataTypes.INTEGER,
                  allowNull: false,
                }
            },
            {
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: "Image",
                tableName: "images",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {
      db.Image.belongsTo(db.Semina, { foreignKey: 'semina_id', targetKey: 'semina_id' });
    }
}

module.exports = Image;

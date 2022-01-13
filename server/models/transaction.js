'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });

      transaction.belongsToMany(models.product, {
        as: "product_order",
        // through is required in this association
        through: {
          model: "product_orders", // this is "bridge" table
          as: "product",
        },
        foreignKey: "idTransaction",
      });
    }
  };
  transaction.init({
    idUser: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    poss_code: DataTypes.INTEGER,
    address: DataTypes.STRING,
    attachment: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser"
        },
      })

      product.belongsToMany(models.transaction, {
        as: "product_order",
        // through is required in this association
        through: {
          model: "product_orders", // this is "bridge" table
          as: "product",
        },
        foreignKey: "idProduct",
      });

    }
  };
  product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    stock: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};
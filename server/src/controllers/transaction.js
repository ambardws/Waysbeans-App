const { user, transaction, product, product_order } = require("../../models");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await transaction.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password", "role", "createdAt", "updatedAt"],
          },
        },
        {
          model: product,
          as: "product_order",
          through: {
            model: product_order,
            as: "products",
            attributes: ["orderQuantity"],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser", "stock"],
          },
        },
      ],
    });

    res.send({
      status: "success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      transaction,
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getMyTransactions = async (req, res) => {
  try {
    let transactions = await transaction.findAll({
      where: {
        idUser: req.user.id,
      },
      attributes: {
        exclude: ["updatedAt", "idUser"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password", "role", "createdAt", "updatedAt"],
          },
        },
        {
          model: product,
          as: "product_order",
          through: {
            model: product_order,
            as: "products",
            attributes: ["orderQuantity"],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser", "stock"],
          },
        },
      ],
    });

    transactions = JSON.parse(JSON.stringify(transactions));

    transactions = transactions.map((item) => {
      return {
        ...item,
        photo_product_order : process.env.FILE_PATH + item.product_order[0].photo,
      };
    });

    res.send({
      status: "success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      transaction,
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const newTransaction = await transaction.create({
      idUser: req.user.id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      poss_code: req.body.poss_code,
      address: req.body.address,
      attachment: req.file.filename,
      status: "Waiting Approve",
    });

    let idTrans = newTransaction.id;

    let data = [req.body.product_order];

    let newData = data.map((item) => {
      return {
        ...item,
        idTransaction: idTrans,
      };
    });

    await product_order.bulkCreate(newData);

    const transactions = await transaction.findOne({
      where: {
        id: idTrans,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password", "role", "createdAt", "updatedAt"],
          },
        },
        {
          model: product,
          as: "product_order",
          through: {
            model: product_order,
            as: "products",
            attributes: ["orderQuantity"],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser", "stock"],
          },
        },
      ],
    });

    res.send({
      status: "success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      status: req.body.status
    }

    await transaction.update(data, {
      where: {
        id,
      },
    });

    const transactions = await transaction.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password", "role", "createdAt", "updatedAt"],
          },
        },
        {
          model: product,
          as: "product_order",
          through: {
            model: product_order,
            as: "products",
            attributes: ["orderQuantity"],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser"],
          },
        },
      ],
    });

    if (req.body.status === 'Success') {
      const updateStock = transactions.product_order[0].stock - transactions.product_order[0].products.orderQuantity
      await product.update({stock : updateStock}, {
        where: {
          id: transactions.product_order[0].id,
        },
      });
    }


    res.send({
      status: "success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

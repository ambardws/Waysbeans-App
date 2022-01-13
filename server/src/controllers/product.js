const { product, user } = require("../../models");
const { Op } = require("sequelize");

exports.getProduct = async (req, res) => {
  try {
    let data = await product.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        photo: process.env.FILE_PATH + item.photo,
      };
    });

    res.send({
      status: "success...",
      product: {
        data,
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

exports.getDetailProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let data = await product.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data.photo = process.env.FILE_PATH + data.photo;

    res.send({
      status: "success...",
      product: {
        data,
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

exports.addProduct = async (req, res) => {
  try {
    const data = req.body;
    const newProduct = await product.create({
      ...data,
      photo: req.file.filename,
      idUser: req.user.id,
    });

    // code here
    res.send({
      status: "success",
      data: {
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        stock: newProduct.stock,
        photo: newProduct.photo,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      name: req?.body?.name,
      price: req?.body?.price,
      description: req?.body?.description,
      stock: req?.body?.stock,
      photo: req?.file?.filename,
    };

    await product.update(data,{
      where: {
        id,
      },
    });

    let responseProduct = await product.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });


    res.send({
      status: "success",
      data: {
        responseProduct
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await product.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete user id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProductByName = async (req, res) => {
  try {
    const {name} = req.params
    let data = await product.findAll({
      where: {
        // name: {[Op.substring]: `${name}`}
        name: {[Op.substring]: `${name}`}
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        photo: process.env.FILE_PATH + item.photo,
      };
    });

    res.send({
      status: "success...",
      product: {
        data,
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

// exports.getDetailProductByName = async (req, res) => {
//   try {
//     const { name } = req.params;

//     let data = await product.findAll({
//       where: {
//         name: {[Op.substring]: `${name}`}
//       },
//       attributes: {
//         exclude: ["createdAt", "updatedAt", "idUser"],
//       },
//     });

//     data = JSON.parse(JSON.stringify(data));

//     data = data.map((item) => {
//       return {
//         ...item,
//         photo: process.env.FILE_PATH + item.photo,
//       };
//     });

//     res.send({
//       status: "success...",
//       product: {
//         data,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.send({
//       status: "failed",
//       message: "Server Error",
//     });
//   }
// };
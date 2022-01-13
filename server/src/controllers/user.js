const { user } = require("../../models");

exports.getUser = async (req, res) => {
  try {
    const data = await user.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "role"],
      },
    });

    res.send({
      status: "success",
      data: {
        user: data,
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

const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(400).json({ message: "token required!" });
  }
  try {
    const decode = jwt.verify(token, process.env.secret_key);
    const user = await userModel.findOne({ _id: decode._id });

    if (user.isAdmin === "true") {
      req.user = decode;
      return next();
    } else {
      return res
        .status(403)
        .json({ message: " access denied. don't have the privileges!" });
    }
  } catch (err) {
    res.status(400).send({ message: "invalid token!" });
  }
  return next();
};

module.exports = verifyToken;

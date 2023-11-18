const express = require("express");
const app = express();
const adminRoute = express.Router();
module.exports = adminRoute;
const { userModel, userValidation } = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

adminRoute.route("/").get((req, res) => {
  res.end("admin GET end point");
});

adminRoute
  .route("/add-user")
  .get((req, res) => {
    res.end("add-user end point admin");
  })
  .post(async (req, res) => {
    const { error } = userValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // const verificationToken = uuidv4();

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await userModel.create({
      ...req.body,
      verificationToken: null,
      password: hashedPassword,
      isVerified: true,
      isAdmin: true,
    });

    console.log("user created successfully with admin authority!");
    res.status(200).send("user created successfully with admin authority!");
  });

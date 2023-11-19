const express = require("express");
const app = express();
const adminRoute = express.Router();
module.exports = adminRoute;
const { userModel, userValidation } = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddle = require("../middleware/auth");

adminRoute.route("/").get((req, res) => {
  res.end("admin GET end point");
});

adminRoute
  .route("/add-user")
  .get((req, res) => {
    res.end("add-user end point admin");
  })
  .post( authMiddle ,async (req, res) => {
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

adminRoute
  .route("/login")
  .get((req, res) => {
    res.end("admin /login get end point!");
  })

  .post(async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password!" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "invalid email or password!" });
      }
      const token = jwt.sign({ userId: user._id}, process.env.secret_key)
      res.send(token)
      // res.status(200).json({message: "logged!"})
    } catch (e) {
      console.error("error occured during login");
      res.status(500).send({ message: "server error" });
    }
  });

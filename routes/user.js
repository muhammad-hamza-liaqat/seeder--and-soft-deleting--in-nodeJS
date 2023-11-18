const express = require("express");
const app = express();
const userRoute = express.Router();
const { userModel, userValidation } = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

userRoute.route("/").get((req, res) => {
  res.end("response from / end point");
});

userRoute
  .route("/add-user")
  .get((req, res) => {
    res.end("response from /add-user");
  })
  .post(async(req, res) => {
    try {
      const { error } = userValidation(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const verificationToken = uuidv4();
      let newUser = await userModel.create({
        ...req.body,
        password: hashedPassword,
        verificationToken: verificationToken,
        isVerified: false,
        isAdmin: false,
      });

      console.log("user created successfully!");
      res.status(200).send("user created successfully!");
    } 
    catch (error) {
      console.error("Unexpected error during user registration:", error);
      res.status(500).send("server error while creating the new user");
    }
  });


  userRoute.route('/verify/:token')
  .get((req,res)=>{
    res.send("verify user end point")
  })
  .patch(async (req, res)=>{
    const {token} = req.params;
    const userVerify = await userModel.findOne({ verificationToken : token})
    if(!userVerify){
      res.status(400).send({message: " user with this token is not found!"});
    }
    if (userVerify){
      userVerify.isVerified = true;
      userVerify.verificationToken = null;
      await userVerify.save()
      res.status(200).send({message: "Congrats!, user verified!"})
      console.log("user verified successfully!")
    }
  })

module.exports = userRoute;

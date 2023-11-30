const express = require("express");
const app = express();
const userRoute = express.Router();
const { userModel, userValidation } = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const {
  transporter,
  sendVerificationEmail,
  emailQueue,
} = require("../services/mailer");
const jwt = require("jsonwebtoken")
userRoute.route("/").get((req, res) => {
  res.end("response from / end point");
});

userRoute
  .route("/add-user")
  .get((req, res) => {
    res.end("response from /add-user");
  })
  .post(async (req, res) => {
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
      // for (var i=0;i<=100;i++){
      //    await emailQueue.add({
      //     to: req.body.email,
      //     subject: "Email Verification",
      //     text: `Click the following link to verify your email: http://localhost:3000/verify/${verificationToken}`,
      //   });


      // }
      await emailQueue.add({
          to: req.body.email,
          subject: "Email Verification",
          text: `Click the following link to verify your email: http://localhost:3000/verify/${verificationToken}`,
        });

      console.log("user created successfully!");
      res.status(200).send("user created successfully!");
    } catch (error) {
      console.error("Unexpected error during user registration:", error);
      res.status(500).send("server error while creating the new user");
    }
  });

userRoute
  .route("/verify/:token")
  .get((req, res) => {
    res.send("verify user end point");
  })
  .patch(async (req, res) => {
    const { token } = req.params;
    const userVerify = await userModel.findOne({ verificationToken: token });
    if (!userVerify) {
      res.status(400).send({ message: " user with this token is not found!" });
    }
    if (userVerify) {
      userVerify.isVerified = true;
      userVerify.verificationToken = null;
      await userVerify.save();
      res.status(200).send({ message: "Congrats!, user verified!" });
      console.log("user verified successfully!");
    }
  });
userRoute.route('/user-login')
.get((req,res)=>{
  res.send("user-login GET endpoint!")
})
.post (async (req,res)=>{
  const {email, password} = req.body
  const user = await userModel.findOne({email})
  if(!user){
    return res.status(400).json({message: 'Invalid email or password!'})
  }
  const validPassword = await bcrypt.compare(password, user.password)
  if(!validPassword){
    return res.status(400).json({message: 'Invalid email or password!'})
  }
  const token = jwt.sign({userId: user._id}, process.env.secret_key)
  res.send(token)
})

module.exports = userRoute;

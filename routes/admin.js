const express = require("express");
const app = express();
const adminRoute = express.Router();
module.exports = adminRoute;
const { userModel, userValidation } = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddle = require("../middleware/auth");
const taskModel = require("../models/taskModel");

adminRoute.route("/").get((req, res) => {
  res.end("admin GET end point");
});

adminRoute
  .route("/add-user")
  .get((req, res) => {
    res.end("add-user end point admin");
  })
  .post(authMiddle, async (req, res) => {
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
      const token = jwt.sign(
        { userId: user._id, isAdmin: true },
        process.env.secret_key
      );
      res.send(token);
      // res.status(200).json({message: "logged!"})
    } catch (e) {
      console.error("error occured during login");
      res.status(500).send({ message: "server error" });
    }
  });

adminRoute
  .route("/add-task")
  .get((req, res) => {
    res.send("add-task GET end point");
  })
  .post(authMiddle,async (req, res) => {
    try {
      const {title, description} = req.body;
      // console.log(req.body);
      const newTask = await taskModel.create({
        title: title,
        description: description,
      });

      await newTask.save();
      res.status(201).json({ message: "task added successfully" });

    } catch (error) {
      console.error(" error occured while adding the task", error);
      res.status(500).json({ message: "internal server error- admin/add-post" });
    }
  });

adminRoute
  .route("/task/:taskID")
  .get((req, res) => {
    res.send("soft deleting end point");
  })
  .put(async (req, res) => {
    try {
      const { taskID } = req.params;
      console.log(taskID)
      const taskFind = await taskModel.findByIdAndUpdate(taskID);
      if (!taskFind) {
        return res.status(200).json({ message: "empty task DB" });
      }
      // trying soft deleting
      taskFind.deleted = true;
      await taskFind.save();
      return res.status(200).send({ message: "done with soft deleting!" });
    } catch (err) {
      console.log("error in soft deleting");
      return res.status(500).json({ message: "server error" });
    }
  });

  adminRoute.route("/all")
  .get(async (req, res) => {
    try {
      const allTask = await taskModel.find({ deleted:false });
      res.json(allTask);
    } catch (error) {
      console.log("error", error);
      res.status(500).send("Internal Server Error"); // You might want to send an appropriate error response
    }
  });

const { userModel, userValidation } = require("../models/userModel");
const mongoose = require("mongoose");
require('dotenv').config();

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ProjectnodeJS', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("db connected");

    const seedData = [
      {
        name: "adminOne",
        email: "admin@gmail.com",
        password: "admin12345",
        isAdmin: true,

      },
      {
        name: "Muhammad Hamza",
        email: "muhammadhamza@gmail.com",
        password: "hamza12345",
        isAdmin: false,
      },
    ];

    for (const data of seedData) {
      const { error, value } = userValidation(data);
      if (error) {
        console.error("validationError", error.details[0].message);
      } else {
        const user = new userModel(value);
        // additional parameters to store that data, if the Db is taking so much time
        await user.save({ writeConcern: { wtimeout: 300000 } });
        console.log("user added successfully!");
      }
    }

    await mongoose.connection.close();
    console.log("db connection closed");
  } catch (error) {
    console.error("db connection error", error);
  }
}

seedDatabase();

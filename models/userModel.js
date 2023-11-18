const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationToken: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: false
  },
});

// adding more validations.
const userJoiSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .min(5)
    .max(40)
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: ["com"] } })
    .regex(/@(google|yahoo|gmail|icloud| outlook| user )\.com$/)
    .required(),

  password: Joi.string().min(5).max(25).required(),

  isAdmin: Joi.boolean().default("false"),
});

const userValidation = (data) => {
  return userJoiSchema.validate(data);
};

module.exports = {
  userModel: mongoose.model("User", userSchema),
  userValidation,
};

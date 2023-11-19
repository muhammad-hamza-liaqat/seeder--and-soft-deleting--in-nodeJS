const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
    enum: ["pending", "failed", "success"],
    default: "pending",
  },
  // adding the soft deleting key..
  deleted: {
    type: Boolean,
    default: false,
  },
});

const taskModel = mongoose.model("Task", taskSchema);
module.exports = taskModel;

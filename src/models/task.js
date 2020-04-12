const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    //luu id_user create this task
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;

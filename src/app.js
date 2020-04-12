const express = require("express");
require("./db/mongoose");
const app = express();
const port = process.env.PORT || 3300;
const userRoute = require("./router/user");
const taskRoute = require("./router/task");
// middleware
// authentication middleware
// kiem tra token cua nguoi dung
//without middleware : new request => run route handler
//
//with middleware : new request => do something => run route handler
app.use(express.json());
//
//setup route
app.use(userRoute);
app.use(taskRoute);

app.listen(port, () => {
  console.log("SERVER IS UP " + port);
});

const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
  // const task = await Task.findById("5e92916745f60903e4ed6a4f");
  // await task.populate("owner").execPopulate();
  const user = await User.findById("5e895df5b3b417371cc70a00");
  await user.populate("tasks").execPopulate();
  console.log(user.tasks);
};
main();

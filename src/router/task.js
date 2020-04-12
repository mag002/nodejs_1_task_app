const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = express.Router();
/*
    1.Find the task
    2. ALter the task properties
    3. save the task
    4. test your work by updating from postman
*/
router.patch("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  //validate update field is allowed
  const updates = Object.keys(req.body); //["name","email"]
  const allowedUpdates = ["description", "completed"]; // not allow password and _id
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  //{name:'abc','email':'abc'}
  try {
    const task = await Task.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    //a gui 1 id khong tai
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (e) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const tasks = await Task.findById(_id);
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/tasks", auth, async (req, res) => {
  const data = req.body;
  //data ={description,completed}
  const task = new Task({
    ...data,
    owner: req.user._id,
  });
  //description, completed
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;

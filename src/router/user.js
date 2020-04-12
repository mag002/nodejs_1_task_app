const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();
// ctrl+k+0
router.post("/users", async (req, res) => {
  const data = req.body;
  try {
    const new_user = new User(data);
    await new_user.save(); //pre save
    const token = await new_user.generateAuthToken();

    res.status(201).send({ new_user, token });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    //da login
    //tao ra token
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    console.log(e);

    res.status(500).send(e.message);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    //tokens=[{_id,token},{...}]
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);

    res.status(500).send(e.message);
  }
});
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    //tokens=[{_id,token},{...}]
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);

    res.status(500).send(e.message);
  }
});

/*
GOAL: Create a way to logout of all sessions

1. Setup POST /users/logoutAll
2. Create the route handler to wipe the tokens array
 - Send 200 or 500
3. Test your work
 - Login a few times and logout all, Check database
 */

//body-parser
//
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});
//user info

router.get("/users/me", auth, async (req, res) => {
  // const userObject= req.user.toObject();
  // delete userObject.password
  // delete userObject.tokens
  //query - instance
  // mongoose before res.send
  // instance.toJSON
  //mongoose: req.user.toJSON()
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  //validate update field is allowed
  const updates = Object.keys(req.body); //["name","email"]
  const allowedUpdates = ["name", "email", "password"]; // not allow password and _id
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  //{name:'abc','email':'abc'}
  try {
    const user = await User.findById(_id);
    //a gui 1 id khong tai
    //{name:'abc',email:'ok'}
    //upates ['name','email']
    // user[name]=req.body[name]
    //user.name = req.body.name
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    // pre('save')
    //instance.presave()
    await user.save();
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate: (value) => {
        if (value.includes("password")) {
          throw new Error("Password doesn't contain 'password'");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
//virtual field

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id", //user
  foreignField: "owner", //task
});

//instance methods
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  //
  const token = jwt.sign({ _id: user._id.toString() }, "kminacademy");
  user.tokens = user.tokens.concat({ token });

  console.log(user);
  await user.save();
  return token;
};
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

//model methods
userSchema.statics.findByCredentials = async (email, password) => {
  //check email is available
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to Login!");
  }
  //check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to Login!");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    //user.password=123
    //
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;

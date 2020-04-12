// 5e8029f2fcb9d33bcc06e3f4
require("../src/db/mongoose");
const User = require("../src/models/user");

const updateNameAndCount = async (id, name) => {
  const user = await User.findByIdAndUpdate(id, { name });
  const count = await User.countDocuments({ name });
  return { user, count };
};
updateNameAndCount("5e8029f2fcb9d33bcc06e3f4", "Ca voi")
  .then((count) => {
    console.log(count);
  })
  .catch((err) => {
    console.log(err);
  });
// User.findByIdAndUpdate("5e8029f2fcb9d33bcc06e3f4", { name: "Ca map 3" })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ name: "Ca map 3" });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//CHALLENGE
/*
  Goal: mess around with promise chaining
  1.create promise-chaining-2.js
  2.load in mongoosedb and task model
  3.remove a given task by id
  4.get a print total number of incompleted tasks
  5.test your work


  */

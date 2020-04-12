require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("5e7ed793fe4bf501c86d390c")
//   .then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

/*
  CHALLENGE
  GOAL: User Async/await

  1. Create deleteTaskAndCount as an async function 
   - Accept id of task to remove
  2. User await to delete task and count incompleted tasks
  3. Return the count
  4. Call the function and attch then/catch to log results
  5. Test your work!
  */

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};
deleteTaskAndCount("5e87f51a84856847108323a1")
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });

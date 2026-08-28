// taskModule.js
// -----------------------------------------------------------------------
// Task 15: Node Modules - Types, Core/Local Modules & Import-Export
//
// This is a LOCAL module (created by us, not built into Node.js, and not
// installed from npm). It is imported into logger.js using require('./taskModule').
// It groups together all the task-saving logic so logger.js can focus on
// being the CLI / entry-point file.
// -----------------------------------------------------------------------

const fs = require('fs');     // fs is a CORE module - built into Node.js, no installation needed
const path = require('path'); // path is also a CORE module

// Absolute path to the tasks file, always relative to this module's own folder
const TASKS_FILE = path.join(__dirname, 'tasks.txt');

// -------------------------------------------------------------------
// Task 8: Asynchronous Programming & Callback Functions
// Error-first callback pattern: callback(err, result)
// -------------------------------------------------------------------
function saveTaskCallback(task, callback) {
  fs.appendFile(TASKS_FILE, task + '\n', (err) => {
    if (err) {
      callback(err); // pass the error as the first argument
    } else {
      callback(null, 'Task saved successfully (callback): ' + task);
    }
  });
}

// -------------------------------------------------------------------
// Promise-based save function (used as the base for Task 11's async/await)
// -------------------------------------------------------------------
function saveTaskPromise(task, filePath = TASKS_FILE) {
  return fs.promises.appendFile(filePath, task + '\n');
}

// -------------------------------------------------------------------
// Task 11: Try/Catch Error Handling & Async-Await Concepts
// awaits saveTaskPromise() inside a try/catch block
// -------------------------------------------------------------------
async function saveTaskAsync(task, filePath = TASKS_FILE) {
  try {
    await saveTaskPromise(task, filePath);
    console.log('Task saved successfully (async/await):', task);
  } catch (err) {
    console.log('Error saving task (async/await):', err.message);
  }
}

// -------------------------------------------------------------------
// Task 4: helper used to timestamp every logged task
// -------------------------------------------------------------------
function getTimestamp() {
  const now = new Date();
  return now.toLocaleString();
}

// Export everything this module offers, using module.exports
module.exports = {
  saveTaskCallback,
  saveTaskPromise,
  saveTaskAsync,
  getTimestamp,
  TASKS_FILE
};

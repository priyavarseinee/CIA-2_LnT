/*
 * logger.js - Command-Line Task Logger
 * CIA-2 Practical Question Paper - Set 1 - Node.js & Asynchronous JavaScript
 * Attempted Tasks: 1, 2, 4, 5, 6, 8, 9, 11, 13, 15
 *
 * -----------------------------------------------------------------------
 * Task 2: How V8 and libuv work together
 * -----------------------------------------------------------------------
 * V8 is the JavaScript engine (built by Google) that Node.js embeds to
 * compile and execute our JavaScript directly into machine code. V8 owns
 * the call stack, the memory heap, and garbage collection, and it runs
 * all of our SYNCHRONOUS code line by line.
 *
 * libuv is a C library that gives Node.js its event loop and a thread
 * pool. Whenever we call an asynchronous API (fs.readFile, timers,
 * network requests, etc.), V8 hands that operation off to libuv. libuv
 * performs the actual work in the background using the operating
 * system's async I/O or its own thread pool. Once the work is done,
 * libuv places the associated callback into the callback/task queue.
 * The event loop then checks whether the V8 call stack is empty, and
 * if it is, it pushes the queued callback back onto the call stack.
 *
 * Together, this lets Node.js be single-threaded for our JS code (via
 * V8) while still being non-blocking for I/O (via libuv).
 * -----------------------------------------------------------------------
 */

// ---- Task 1: confirms the app runs ----
console.log('Task Logger Started');

const fs = require('fs');
const readline = require('readline');

// ---- Task 15: import the local module that owns the save logic ----
const taskModule = require('./taskModule');

// -------------------------------------------------------------------
// Task 2: Demonstrating non-blocking behaviour
// -------------------------------------------------------------------
fs.readFile(taskModule.TASKS_FILE, 'utf8', (err, data) => {
  if (err) {
    console.log('[fs.readFile callback] No existing tasks.txt found yet.');
  } else {
    console.log('[fs.readFile callback] Current tasks.txt contents:\n' + data);
  }
});
console.log('This line prints immediately, before the file is read - proving fs.readFile is non-blocking.');

// -------------------------------------------------------------------
// Task 4: Timestamped logging
// (Snippet was first tried in the Node.js REPL:
//    > const now = new Date();
//    > now.toLocaleString();
//  then moved here using taskModule.getTimestamp())
// -------------------------------------------------------------------
function logTask(task) {
  const timestamp = taskModule.getTimestamp();
  console.log(`[${timestamp}] Task logged: ${task}`);
}

// -------------------------------------------------------------------
// Task 5: process.argv and process.stdin
// -------------------------------------------------------------------
const taskFromArgs = process.argv.slice(2).join(' ') || 'No task description provided';
console.log('Task received from command line:', taskFromArgs);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`Save the task "${taskFromArgs}"? (y/n): `, (answer) => {
  if (answer.trim().toLowerCase() === 'y') {
    console.log('Confirmed. Saving task...');
    logTask(taskFromArgs);

    // ---- Task 8: callback-based save ----
    taskModule.saveTaskCallback(taskFromArgs, (err, message) => {
      if (err) {
        console.log('Failed to save task (callback):', err.message);
      } else {
        console.log(message);
      }
    });

    // ---- Task 11: async/await save with try/catch ----
    taskModule.saveTaskAsync(taskFromArgs);

    // To DEMONSTRATE Task 11's catch block firing, temporarily point the
    // save to a folder that does not exist by uncommenting the next line:
    // taskModule.saveTaskAsync('Test error handling', './no-such-folder/tasks.txt');

  } else {
    console.log('Task discarded by user.');
  }
  rl.close();
});

// -------------------------------------------------------------------
// Task 9: Timers and global objects
// -------------------------------------------------------------------
setTimeout(() => {
  console.log('Reminder: review your tasks');
}, 5000); // fires once, 5s after the app starts

let taskCount = 0;
const intervalId = setInterval(() => {
  taskCount++;
  console.log(`Tasks logged so far (tick): ${taskCount}`);
}, 3000); // fires every 3s

setTimeout(() => {
  clearInterval(intervalId);
  console.log('Stopped the periodic task counter after 15 seconds.');
}, 15000);

// -------------------------------------------------------------------
// Task 13: Predicting event loop / job queue order
//
// Prediction (written BEFORE running):
// 'start' -> 'end' -> 'promise' -> 'timeout'
// Reasoning: the two console.log() calls are synchronous and run first.
// Promise.resolve().then() is queued as a MICROTASK, which the event
// loop always drains before moving on. setTimeout(...,0) is queued as
// a MACROTASK/timer callback, which only runs after all microtasks are
// done - so 'timeout' prints last.
// -------------------------------------------------------------------
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
// Actual output after running (confirmed in terminal): start, end, promise, timeout
// The prediction was correct.

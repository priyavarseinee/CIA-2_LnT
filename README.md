# Task Logger — CIA-2 Practical (Set 1)

**Name:** Priyavarseinee Anthiyur Somasundaram
**Register Number:** 2462127
**Class:** 5BT CS AIML A

Command-line Task Logger app built for CIA-2 (Node.js & Asynchronous JavaScript).

**Attempted Tasks:** Task 1, Task 2, Task 4, Task 5, Task 6, Task 8, Task 9, Task 11, Task 13, Task 15

## Files

- `logger.js` — entry point / CLI (Tasks 1, 2, 4, 5, 9, 13)
- `taskModule.js` — local module with all save-related functions (Tasks 8, 11, 15)
- `package.json` — project config + nodemon dev script (Task 6)

## Setup

```bash
npm install
```

## Run

```bash
node logger.js Finish CIA-2 practical file
```

You'll be prompted to confirm (`y`/`n`) before the task is saved to `tasks.txt`.

## Run with NodeMon (auto-restart on save)

```bash
npm run dev
```

## Task 11 error-demo

To see the `catch` block fire, open `logger.js` and uncomment the line inside the `rl.question` callback that points `saveTaskAsync` at `./no-such-folder/tasks.txt`.

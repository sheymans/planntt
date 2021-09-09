[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# planntt

Planntt is a todo-application with a focus on keeping all your data on your computer at all times.

## Features

- transparent storing of your data in a directory on your laptop
- organize your tasks in projects
- a `today`/`this week`/`someday`/`waiting for` for your tasks per project
- task details can be Markdown
- set due dates on tasks
- sort your tasks
- duplicate a task including the task details
- mark a task as blocked
- open the project hierarchy from a task's project
- a `focus mode` that tracks how many sessions you had on the task as well as how much time you spent
- a `Journal` view that allows you to store notes independent of tasks. Allows to import a CSV with your own existing notes
- a full Archive of your done tasks that you can export
- search your tasks, your archived (done) tasks, your journal notes
- `statistics` for your completed tasks, created tasks, time spent in focus mode, and much more.

## Development

```
# Install dependencies
npm install

# Run planntt locally
npm run dev

# Build planntt for production
npm run build
```

# Acknowledgements

The first version of this project was originally generated in 2018 with
[electron-vue](https://github.com/SimulatedGREG/electron-vue)@[7c4e3e9](https://github.com/SimulatedGREG/electron-vue/tree/7c4e3e90a772bd4c27d2dd4790f61f09bae0fcef).

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![example workflow](https://github.com/sheymans/planntt/actions/workflows/test.yml/badge.svg)

![Electron.js](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Apple](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=white)

<a href="https://stijnheymans.net/planntt"><img src="https://stijnheymans.net/planntt/images/planntt.png" width="300px"/></a>

# planntt

[Planntt](https://stijnheymans.net/planntt/) is a todo-application with a focus on keeping all your data on your computer at all times.

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

## Download for Mac OS X

The latest version can be downloaded from 
the [github releases](https://github.com/sheymans/planntt/releases/).

## Development

```
# Install dependencies
npm install

# Run planntt locally
npm run dev

# Run integration tests
npm run test

# Build planntt
npm run build
```

Note that the build step (`npm run build`) will require an `APPLEID` and an `APPLEIDPASS` as well as permissions to create releases
for this repository, aka you'll probably want to avoid running `npm run build` yourself.

## Changelog

The changelog can be found in the [repository](./docs/CHANGELOG.md).

## License

planntt is [free software](https://www.gnu.org/philosophy/free-sw.en.html), licensed under the [GPLv3](./LICENSE).

## Acknowledgements

The first version of this project was originally generated in 2018 with
[electron-vue](https://github.com/SimulatedGREG/electron-vue)@[7c4e3e9](https://github.com/SimulatedGREG/electron-vue/tree/7c4e3e90a772bd4c27d2dd4790f61f09bae0fcef).

See [package.json](./package.json) for a list of software used by planntt.

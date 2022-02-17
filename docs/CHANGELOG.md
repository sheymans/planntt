
<meta charset="utf-8" lang="en">

**Planntt Changelog**


**[1.6.2]** - _2021-12-11_

- Refactored use of [marked](https://github.com/markedjs/marked) and upgraded to `4.0.7`

**[1.6.1]** - _2021-10-08_

- Replace hardcoded `uuid` function by [uuid library](https://github.com/uuidjs/uuid) ([#3](https://github.com/sheymans/planntt/issues/3) by [fgkolf](https://github.com/fgkolf) )

**[1.6.0]** - _2021-10-06_

- Add `per year` stats ([#6](https://github.com/sheymans/planntt/issues/6))
- Remove `duration` stats -- not clear what they contribute.

**[1.5.6]** - _2021-10-05_

- Fix wrong week being shown due to US weeks starting Sunday per `moment`. Using `isoWeek` now to have weeks in US also start on Monday ([#4](https://github.com/sheymans/planntt/issues/4))

**[1.5.5]** - _2021-10-01_

- Fix that an archived task of a renamed project had the old name ([#1](https://github.com/sheymans/planntt/issues/1))

**[1.5.4]** - _2021-09-24_

- Add integration test framework ([Spectron](https://www.electronjs.org/spectron) and [mocha](https://mochajs.org/)) with initial tests

**[1.5.3]** - _2021-09-22_

- Bump the version to test [github releases](https://github.com/sheymans/planntt/releases/)

**[1.5.2]** - _2021-09-22_

- Publish releases to github (this version will publish still to the old location so that auto-updates do not break).

**[1.5.1]** - _2021-09-08_

- Remove `webpack.web.config.js` -- non-user facing.
 
**[1.5.0]** - _2021-09-01_

- Remove `vue-js-modal` in preparation for Vue 3.x
- Context menu for projects is now based on [tippy](https://atomiks.github.io/tippyjs/), which I also use for tooltips

**[1.4.0]** - _2021-08-31_

- Replace `vue-moment` by `momentjs` in preparation for Vue 3.x
- Remove `vue-context-menu` and do context items for projects visually (delete/add/edit project) in preparation for Vue 3.x

**[1.3.2]** - _2021-08-30_

- Upgrade `vue-js-modal` from `1.3.35` to `2.0.1`
- Upgrade `css-loader` from `5.2.7` to `6.2.0`
- Deprecate `url-loader` and `file-loader`. The upgrade of `css-loader` requires deprecating `url-loader` and `file-loader`, see the `css-loader` [v6 release notes](https://github.com/webpack-contrib/css-loader/releases/tag/v6.0.0 )
- Upgrade `vuex` from `3.1.2` to `3.6.2`

**[1.3.1]** - _2021-08-29_

- Upgrade `vue2-datepicker` from v2 to `3.9.2`

**[1.3.0]** - _2021-08-18_

- As `vue-directive-tooltip` relies on a deprecated [Popper](https://popper.js.org/) (v1), I upgraded to use [tippy](https://atomiks.github.io/tippyjs/) for tooltips. I also updated the existing style, hence the minor version bump.

**[1.2.0]** - _2021-08-14_

- Update `About planntt` menu item with link to Changelog (this page).

**[1.1.0]** - _2021-08-13_

- Add a [buy me a coffee](https://www.buymeacoffee.com/stijnh) support button.

**[1.0.2]** - _2021-08-12_

- Bugfix for same issue as in 1.0.1

**[1.0.1]** - _2021-08-12_

- Bugfix with initial loading (resulting in blank screen).

**[1.0.0]** -  _2021-08-12_

First version after 97 alpha releases. A note on the versioning going
forward: Versions will have the form `x.y.z` where:

- `x` is the major release version and will only increase with backward incompatible versions. For an app like planntt, 
  this would only occur if you'd have to either manual re-install planntt or 
you would have to change underlying files manually based on instructions. Aka, if this happens
it'll be an embarrassment that will be known far and wide but probably mostly in Merchtem.
- `y` is the minor release version and will increase for every feature added, deleted, or changed. In other words,
anything that you, the user, will notice and that is hopefully good. Not an embarrassment.
- `z` are patch releases. Any bug fixes will go here as well as upgrades to underlying packages.

This is loosely inspired by [npm's write-up of semantic versioning](https://docs.npmjs.com/about-semantic-versioning).

With that out of the way, this first version 1.0.0 mostly had underlying package upgrades:

- `webpack` from 3 to 5
- `babel-core` (and related) to `@babel/core 7.15.0`
- `nedb` is no longer maintained it seems, so we moved to a maintained fork: [`@seald-io/nedb`](https://github.com/seald/nedb).
- replaced `open` with electron's [`shell.openExternalUrl`](https://www.electronjs.org/docs/api/shell#shellopenexternalurl-options) (critical vulnerability)

**[0.0.97]** -  _2021-08-08_

- _migrated_ any use of `remote` to `@electron/remote`
- _upgraded_ electron-builder: from 21.2.0 to 22.11.7
- _upgraded_ muze: from 1.3.2 to 2.0.0
- _upgraded_ copy-webpack-plugin: from 4.0.1 to 4.6.0
- _upgraded_ electron: from 7.1.3 to 13.1.7
- _upgraded_ electron-debug: from 1.4.0 to 1.5.0
- _upgraded_ axios: from 0.16.1 to 0.21.1
- _upgraded_ vue-directive-tooltop: from 1.5.1 to 1.6.3
- _removed_ electron-devtools-installer and vue-devtools

**[0.0.96]** -  _2021-02-06_

- Full screen for reading journal notes.

**[0.0.95]** -  _2020-11-04_

- Doing ⌘+e in the Journal view will copy your (possibly filtered) journal entries to your clipboard. So if you then do a paste (⌘+v) in your favorite editor, 
  you'll have a summary of those journal entries, formatted in Markdown.
  For now this is without any other UI elements, so you'd have to _know_ to do ⌘+e. I may or may not make this a regular feature, 
  but for now this is your one and only heads-up. 

**[0.0.94]** -  _2020-10-17_

- fix `null` when hovering over links (well, that took a while)
- _copy to clipboard_ of raw markdown for journal items

**[0.0.93]** -  _2020-05-08_

- fix breaking words in notes/journal
- reduce font size in notes/journal

**[0.0.92]** -  _2020-04-09_

- fix spacing today/thisweek/waitingfor/someday

**[0.0.91]** -  _2020-04-09_

- move from Raleway font to [Jetbrains Mono](https://www.jetbrains.com/lp/mono/) for better readability

**[0.0.90]** -  _2020-03-29_

- add styling for blockquote/reply in markdown (things preceded by `>` in your notes)

**[0.0.89]** -  _2020-03-21_

- increase size of stats graphs
- improve journal entry title overflow when journal entry is selected

**[0.0.88]** -  _2020-03-13_

- fix broken stats (tasks per month) by upgrading [muze](https://muzejs.org/) to `1.3.2`

**[0.0.87]** -  _2020-03-08_

- improve formatting of code snippets in task details/journal entries

**[0.0.86]** -  _2020-02-13_

- break words in notes at any character to prevent overflow

**[0.0.85]** -  _2020-02-13_

- up and down arrows can now navigate through journal list as well as task list
- journal entry editing is moved to side from bottom to create more space for editing journal entries

**[0.0.84]** -  _2020-02-12_

- code snippets in notes are properly wrapped now rather than expanding width of note

**[0.0.83]** -  _2020-02-11_

- fix paragraph styling for notes

**[0.0.82]** -  _2020-02-09_

- allow you to import any CSV into your journal, provided the first row of the CSV is `Date,Note,Name` 

**[0.0.81]** -  _2020-02-06_

- add searchable journal/log capability

**[0.0.80]** -  _2020-01-21_

- fix bug with up and down arrow while editing note.

**[0.0.79]** -  _2020-01-10_

- fix dates in stats by updating to `vue-moment` 4.1.0
- pressing up or down arrow when no task is selected now selects the last or first task respectively

**[0.0.78]** -  _2019-12-25_

- change keyboard short cut from ⌘+↑ to ctrl+⌘+↑ and from ⌘+↓ to ctrl-⌘+↓ for re-ordering tasks

**[0.0.77]** -  _2019-12-23_

- add ability to change the default order of tasks via up command-key + up arrow (⌘+↑) and command-key + down arrow (⌘+↓)
- add ability to quickly select tasks using up and down arrows

**[0.0.76]** -  _2019-12-20_

- move editing pencil closer to task name
- replace close detail arrow with an x
- move note editing controls to the left for easier access
- add shortcuts ctrl-f for focus mode, ctrl-d for duplicating a task, ctrl-p for opening a project

**[0.0.75]** -  _2019-12-17_

- move task details back to bottom
- add icons to mark done and remove selected buttons

**[0.0.74]** -  _2019-12-15_

- add number of sessions and total time spent columns to exported CSV from archive
- bug fix: when closing detail for a task and navigating out to projects and coming back to main Projects, the details of the task should still be closed.
- bug fix: changing location for saving file after update to electron
- bug fix: `dialog.showMessageBox` returns a `Promise` after update to electron; modified the auto-updater to do this properly.

**[0.0.73]** -  _2019-12-13_

- bug fix: do not show scrollbars when there's nothing to scroll
- dialog that informs that there is an upgrade available just asks to restarts rather than attempting to restart
- task in focus mode has improved alignment when the title of the task is long

**[0.0.72]** -  _2019-12-13_

- Moved task details to left hand rather than below task list.

**[0.0.71]** -  _2019-12-11_

- Removed vertical divider
- Notarized Mac OS X app and removed Linux app

**[0.0.70]** -  _2019-12-08_

- Bug fix for changing task selection while editing task and then pressing cancel, cancelled the description of the previously selected task

**[0.0.69]** -  _2019-12-08_

- Changed hovering color as well as background color task detail.
- Improved layout of task detail.

**[0.0.68]** -  _2019-12-06_

- Clicking on project name in task list, opens up that project in the project tree.
- Made font weights of number of sessions and other counters less light.

**[0.0.67]** -  _2019-11-22_

- Improve position of focus pop-over on task list.
- Upgraded `electron-builder` to `21.2.0` for Mac OS X 10.15 building.

**[0.0.66]** -  _2019-08-01_

- Task list is taking more space when no task is selected. You can press ESC to unselect task.

**[0.0.65]** -  _2019-07-31_

- Fixes for focused time spent.

**[0.0.64]** -  _2019-07-25_

- Show hours on focused task: so instead of _this session: 5m10s_ correctly show _this session: 1h5m10s_ if you have been in focus mode for longer than 1 hour

**[0.0.63]** -  _2019-07-21_

- Removed confusion around selection a task and marking as today/thisweek/waitingfor, and checking a task's checkbox.

**[0.0.62]** -  _2019-06-25_

- Fix for showing statistics when no focused time was spent

**[0.0.61]** -  _2019-06-25_

- Add statistics for focused time per day/ per week/ per month on _statistics_ page.

**[0.0.60]** -  _2019-06-25_

- Bugfix: Show focused time this week also when there are gaps in focused time for certain days (e.g., Tuesday no focused time logged)

**[0.0.59]** -  _2019-06-25_

- Add focused time total for this week (since Monday).

**[0.0.58]** -  _2019-06-24_

- Cleaner showing of focused time spent today.

**[0.0.57]** -  _2019-06-24_

- Do not show time spent in focus mode today if you've not spent any time in focus mode.

**[0.0.56]** -  _2019-06-24_

- Track how much time you've spent in _focus mode_ today. Ideally, as much as possible of your time is spent in this mode.
- Show seconds passing by in focus mode cause that's what you want to be doing in focus mode: stare at time passing by.
- Removed average time per session: there is such a thing as too much statistics.


**[0.0.55]** -  _2019-06-20_

- Bugfix: show number of sessions correctly as 0 rather than as 1 in task details 

**[0.0.54]** -  _2019-06-19_

- Add timers to task when your in _focused task_ mode:
    - how many sessions you had with this task
    - how long this session is going
    - what your total time spent on the task is
    - what your average time spent on the task is

**[0.0.53]** -  _2019-06-16_

- Added more margin around closing _X_ for a focused task
- Enabled closing a focused task with the Escape key.

**[0.0.52]** -  _2019-06-06_

- Added a focus mode for tasks, showing only task title and note when clicking headphones icon

**[0.0.51]** -  _2019-06-04_

- Fixed allowing tasks to be blocked; hopefully.

**[0.0.50]** -  _2019-06-03_

- Backing out allowing tasks to be marked as blocked; it's very broken.

**[0.0.49]** -  _2019-06-03_

- Allow tasks to be marked as blocked.

**[0.0.48]** -  _2019-05-26_

- Adding new task input field now has dual purpose of also filtering tasks in project view.

**[0.0.47]** -  _2019-04-07_

- Case-insensitive search in _Archive_ (searching for "stuff" or "StuFF" will return same results)
- Showing counter for Archived tasks

**[0.0.46]** -  _2019-04-01_

- Bugfix for archiving of duplicated tasks

**[0.0.45]** -  _2019-03-26_

- Added statistics for average duration of tasks (from creation to completion)
- Bugfix for statistics per week crossing a year (2018 to 2019)


**[0.0.44]** -  _2019-03-24_

- Bugfix for deleting of duplicated tasks

**[0.0.43]** -  _2019-03-24_

- Increase space between different statistics types
- Added _duplicate task_ functionality
- Added tooltips for pencil (edit task name) and clone (duplicate task) symbols on task details

**[0.0.42]** - _2019-03-20_

- Added _created_ date information on task details
- Added stats for created tasks per day, per week, and per month.

**[0.0.41]** - _2018-11-27_

- Export archived tasks to CSV (Excel).

**[0.0.40]** - _2018-11-01_

- Bug fix for stats completed tasks per week.

**[0.0.39]** - _2018-10-27_

- Added stats for completed tasks per minute, per hour, and per weekday to see what times of the day and week you are most productive.

**[0.0.38]** - _2018-10-27_

- Added stats for completed tasks per week.

**[0.0.37]** - _2018-10-22_

- Added stats, for now only completed tasks per day and per month. Work in Progress.

**[0.0.36]** - _2018-10-17_

- Added filter functionality to _Archive_. Currently limited to exact phrases only. Can filter on date, project name, task name, description, and when the task happened (_today_, _thisweek_, _waitingfor_, _someday_).

**[0.0.35]** - _2018-10-01_

- Add extra margin to data location in bottom right.
- Fix bug when adding task on first run of planntt as well as when adding task to newly created project that has still its default name.

**[0.0.34]** - _2018-09-25_

- Allow to change folder where your data gets saved. This way you can make, for example, a Dropbox folder your data folder.

**[0.0.33]** - _2018-09-18_

- Add deadlines page, which summarizes any task with a due date.


**[0.0.32]** - _2018-09-17_

- Fix fonts for due date selector.

**[0.0.31]** - _2018-09-16_

- Open _All Projects_ by default as well as expand _today_ and _this week_.

**[0.0.30]** - _2018-09-15_

- Add _due date_ to tasks

**[0.0.29]** - _2018-08-31_

- Sort tasks with oldest creation date on top

**[0.0.28]** - _2018-08-27_

- Add _when_ label to archive.


**[0.0.27]** - _2018-08-24_

- Show notes on archived tasks when selected.

**[0.0.26]** - _2018-08-20_

- Keep state of selected task to edit when moving from _Archive_ back to _Projects_.

**[0.0.25]** - _2018-08-18_

- Keep state of project expanded/collapsed and state of task tab (today, this week, ...) while moving from _Archive_ to _Projects_ view and back.

**[0.0.24]** - _2018-08-16_

- Distinguish between marking a task as done versus removing it. When you mark it as done, it will be listed in the _Archive_.

**[0.0.23]** - _2018-08-13_

- Fix for when adding task to keep corresponding tab (_today_, _this week_, etc) open rather than open and close.


**[0.0.22]** - _2018-08-11_

- Changed font family from _Roboto Mono_ to _Raleway_ for notes.
- Adding a task to a selected _when_ (for example, _someday_) will expand that section so you can easily see what you added.
- Expand _when_ task when clicking; only clicking a triangle expands.

**[0.0.21]** - _2018-07-01_

**[0.0.20]** - _2018-06-21_

**[0.0.17-0.0.19]** - _2018-06-20_

**[0.0.16]** - _2018-05-31_

**[0.0.15]** - _2018-05-30_

**[0.0.14]** - _2018-05-25_

**[0.0.012-0.0.13]** - _2018-05-24_

**[0.0.11]** - _2018-05-23_

**[0.0.8-0.0.10]** - _2018-05-22_

**[0.0.2-0.0.7]** - _2018-05-21_

**[0.0.1]** - _2018-05-17_

<link rel="stylesheet" href="https://casual-effects.com/markdeep/latest/latex.css?">
<!-- Markdeep: --><style class="fallback">body{visibility:hidden}</style><script src="https://casual-effects.com/markdeep/latest/markdeep.min.js?" charset="utf-8"></script>

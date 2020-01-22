<template>
    <div class="taskList">
        <div :class="{'tasks': isTaskSelected, 'tasksLarge': !isTaskSelected}">
            <div class="taskHeader">
                    <b>{{selectedProjectName | capitalize}} ({{numberOfProjectTasks}})</b>
            </div>
            <input class="taskInput"
                   autofocus autocomplete="off"
                   placeholder="Filter tasks/press enter to add a new task"
                   v-model="newTaskText"
                   @keyup.enter="addTask">

            <div class="removeTasksLine">
                <button v-show="numberOfCompletedProjectTasks > 0" class="archiveTasks" @click="archiveCompleted">
                    <font-awesome-icon icon="check"/> mark done
                </button>
                <button v-show="numberOfCompletedProjectTasks > 0" class="removeTasks" @click="removeCompleted">
                    <font-awesome-icon icon="trash-alt"/> remove selected
                </button>
            </div>

            <div class="theSelectableTaskList">
                <div :class="{'taskListDivisions': isTaskSelected, 'taskListDivisionsLarge': !isTaskSelected}">
                    <div class="todayList">
                    <font-awesome-icon class="caretIcon" @click="setWhenStatus('today')" :icon="getWhenStatusExpandedIcon('today')"/>
                    <span class="taskTab">
                        <a :class="{'is-active': isTabActive('today')}" @click="setActiveTab('today')">today ({{projectTasks['today'].length}})</a>
                        <span v-show="focusedTimeToday" class="focusToday"><font-awesome-icon v-tooltip.left="{content:'time in focus mode today', class:'tooltip', delay: 50}" icon="headphones"/> {{focusedTimeToday}}</span>
                    </span>
                    <div class="tasksInTab" v-if="projectTasks['today'].length && todayStatus">
                        <Task v-for="task in projectTasks['today']"
                              :key="task.id"
                              @setSelectedTask="setSelectedTask"
                              @unsetSelectedTask="unsetSelectedTask"
                              :task="task"/>
                    </div>
                </div>
                <div class="thisweekList">
                    <font-awesome-icon class="caretIcon"  @click="setWhenStatus('thisweek')" :icon="getWhenStatusExpandedIcon('thisweek')"/>
                    <span class="taskTab">
                        <a :class="{'is-active': isTabActive('thisweek')}" @click="setActiveTab('thisweek')">this week ({{projectTasks['thisweek'].length}})</a>
                        <span v-show="focusedTimeThisWeek" class="focusToday"><font-awesome-icon v-tooltip.left="{content:'time in focus mode this week', class:'tooltip', delay: 50}" icon="headphones"/> {{focusedTimeThisWeek}}</span>
                    </span>

                    <div class="tasksInTab"  v-if="projectTasks['thisweek'].length && thisWeekStatus">
                        <Task v-for="task in projectTasks['thisweek']"
                              :key="task.id"
                              @setSelectedTask="setSelectedTask"
                              @unsetSelectedTask="unsetSelectedTask"
                              :task="task"/>
                    </div>
                </div>

                <div class="waitingforList">
                    <font-awesome-icon class="caretIcon"  @click="setWhenStatus('waitingfor')" :icon="getWhenStatusExpandedIcon('waitingfor')"/>
                    <a :class="{'is-active': isTabActive('waitingfor')}" class="taskTab" @click="setActiveTab('waitingfor')">waiting for ({{projectTasks['waitingfor'].length}})</a>
                    <div class="tasksInTab" v-if="projectTasks['waitingfor'].length && waitingforStatus">
                        <Task v-for="task in projectTasks['waitingfor']"
                              :key="task.id"
                              @setSelectedTask="setSelectedTask"
                              @unsetSelectedTask="unsetSelectedTask"
                              :task="task"/>
                    </div>
                </div>

                <div class="somedayList">
                    <font-awesome-icon class="caretIcon"  @click="setWhenStatus('someday')" :icon="getWhenStatusExpandedIcon('someday')"/>
                    <a :class="{'is-active': isTabActive('someday')}" class="taskTab" @click="setActiveTab('someday')">someday ({{projectTasks['someday'].length}})</a>
                    <div class="tasksInTab" v-if="projectTasks['someday'].length && somedayStatus">
                        <Task v-for="task in projectTasks['someday']"
                              :key="task.id"
                              @setSelectedTask="setSelectedTask"
                              @unsetSelectedTask="unsetSelectedTask"
                              :task="task"/>
                    </div>
                    </div>
                </div>
                    <TaskDetail :task="selectedTask" @duplicateTask="duplicateTask" @setWhen="setWhen" @moveUp="moveUpTask" @moveDown="moveDownTask" @closeDetail="closeDetail"/>
                </div>
        </div>

    </div>
</template>

<script>
  import Task from './Task.vue'
  import TaskDetail from './TaskDetail'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

  export default {
    name: 'TaskList',
    components: {
      TaskDetail,
      Task,
      FontAwesomeIcon
    },
    data () {
      return {
        newTaskText: '',
        tasks: [],
        selectedTask: {},
        focusedTime: []
      }
    },
    computed: {
      editingNote: function () {
        return this.$store.getters.isEditingNote
      },
      isTaskSelected: function () {
        return Object.keys(this.selectedTask).length !== 0
      },
      focusedTimeToday: function () {
        let totalTimeSpent = 0
        if (this.$store.getters.getFocusedTimeToday) {
          totalTimeSpent = this.$store.getters.getFocusedTimeToday
        } else {
          return null
        }
        const hours = Math.floor(totalTimeSpent / 3600)
        const minutes = Math.floor((totalTimeSpent - (hours * 3600)) / 60)
        const seconds = totalTimeSpent - (hours * 3600) - (minutes * 60)
        return hours + 'h:' + minutes + 'm:' + seconds + 's'
      },
      focusedTimeThisWeek: function () {
        let totalTimeSpent = 0
        if (this.$store.getters.getFocusedTimeThisWeek) {
          totalTimeSpent = this.$store.getters.getFocusedTimeThisWeek
        } else {
          return null
        }
        const hours = Math.floor(totalTimeSpent / 3600)
        const minutes = Math.floor((totalTimeSpent - (hours * 3600)) / 60)
        const seconds = totalTimeSpent - (hours * 3600) - (minutes * 60)
        return hours + 'h:' + minutes + 'm:' + seconds + 's'
      },
      activeTab: function () {
        return this.$store.getters.getSelectedTaskTab
      },
      todayStatus: function () {
        return this.$store.getters.isExpanded('today')
      },
      thisWeekStatus: function () {
        return this.$store.getters.isExpanded('thisweek')
      },
      waitingforStatus: function () {
        return this.$store.getters.isExpanded('waitingfor')
      },
      somedayStatus: function () {
        return this.$store.getters.isExpanded('someday')
      },
      projectTasks: function () {
        // Clean up tasks (set as INBOX project if the project is gone)
        let deletedProjects = this.$store.getters.getDeletedProjects
        this.tasks.forEach(task => {
          if (deletedProjects.includes(task.project)) {
            console.log('set project of task with id' + task.id + ' to INBOX')
            this.$set(task, 'project', 1)
            // Update DB
            this.$taskDb.update({id: task.id}, { $set: { project: task.project } }, {})
          }
        })

        // Make a copy cause this.tasks does not seem to change when sorting.
        let ts = this.tasks

        // Sort with oldest created on top, today before this week, this week before waiting for and waiting for before someday
        ts.sort((a, b) => {
          if (a.order && b.order) {
            return a.order - b.order
          }
          if (a.when === 'today' && (b.when === 'thisweek' || b.when === 'waitingfor' || b.when === 'someday')) {
            return -1
          }
          if (a.when === 'thisweek' && (b.when === 'waitingfor' || b.when === 'someday')) {
            return -1
          }
          if (a.when === 'waitingfor' && (b.when === 'someday')) {
            return -1
          }
          if (a.when === 'someday' && b.when !== 'someday') {
            return 1
          }
          if (a.when === b.when && a.created && b.created) {
            return a.created - b.created
          }
          if (a.when === b.when && a.created) {
            return 1
          }
          return 1
        })

        // If there's no order on the first task, there's no order anywhere: set them all.
        if (ts && ts.length > 0) {
          let firstTask = ts[0]
          if (!firstTask.order) {
            let order = 1
            console.log('setting order on each task fresh')
            ts.forEach(task => {
              this.$set(task, 'order', order)
              this.$taskDb.update({id: task.id}, {$set: {order: task.order}}, {})
              ++order
            })
          } else {
            // don't do anything; order has been set already
          }
        }

        let projectsToConsider = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        let allTasksToShow = ts.filter(task => projectsToConsider.includes(task.project))

        let mapOfTasksPerWhen = {'today': [], 'thisweek': [], 'waitingfor': [], 'someday': []}

        mapOfTasksPerWhen['today'] = allTasksToShow.filter(t => t.when === 'today' && this.searchFilter(t, this.newTaskText))
        mapOfTasksPerWhen['thisweek'] = allTasksToShow.filter(t => t.when === 'thisweek' && this.searchFilter(t, this.newTaskText))
        mapOfTasksPerWhen['waitingfor'] = allTasksToShow.filter(t => t.when === 'waitingfor' && this.searchFilter(t, this.newTaskText))
        mapOfTasksPerWhen['someday'] = allTasksToShow.filter(t => t.when === 'someday' && this.searchFilter(t, this.newTaskText))

        // If selected task is not in any of the mapOfTasksPerWhen, then unset it.
        if (this.selectedTask && !(mapOfTasksPerWhen['today'].includes(this.selectedTask) || mapOfTasksPerWhen['thisweek'].includes(this.selectedTask) || mapOfTasksPerWhen['waitingfor'].includes(this.selectedTask) || mapOfTasksPerWhen['someday'].includes(this.selectedTask))) {
          this.selectedTask = {}
        }

        return mapOfTasksPerWhen
      },
      projectTasksFlat: function () {
        let flat = []
        flat = flat.concat(this.projectTasks['today'])
        flat = flat.concat(this.projectTasks['thisweek'])
        flat = flat.concat(this.projectTasks['waitingfor'])
        flat = flat.concat(this.projectTasks['someday'])
        return flat
      },
      selectedProject: function () {
        return this.$store.getters.getSelectedProject
      },
      selectedProjectName: function () {
        return this.$store.getters.getSelectedProjectName
      },
      numberOfCompletedProjectTasks: function () {
        if (this.projectTasks) {
          let completedTasksToday = this.projectTasks['today'].filter(t => t.completed)
          let completedTasksThisWeek = this.projectTasks['thisweek'].filter(t => t.completed)
          let completedTasksWaitingFor = this.projectTasks['waitingfor'].filter(t => t.completed)
          let completedTasksSomeday = this.projectTasks['someday'].filter(t => t.completed)
          return completedTasksToday.length + completedTasksThisWeek.length + completedTasksSomeday.length + completedTasksWaitingFor.length
        } else {
          return 0
        }
      },
      numberOfProjectTasks: function () {
        if (this.projectTasks) {
          let completedTasksToday = this.projectTasks['today']
          let completedTasksThisWeek = this.projectTasks['thisweek']
          let completedTasksWaitingFor = this.projectTasks['waitingfor']
          let completedTasksSomeday = this.projectTasks['someday']
          return completedTasksToday.length + completedTasksThisWeek.length + completedTasksSomeday.length + completedTasksWaitingFor.length
        } else {
          return 0
        }
      }
    },
    created () {
      document.addEventListener('keydown', this.keyHandler)
      // Load the data (note we need the self, cause of the callback scope; we could try using an arrow function here)
      let self = this
      this.$taskDb.find({}, function (err, docs) {
        if (err) {
          console.log(err.stack)
          return
        }
        if (docs && docs.length > 0) {
          self.tasks = docs
          console.log('read existing task list from db')
        }
      })
      // TODO: update this find to only get relevant dates (today, yesterday, this week, last week)
      this.$focusedTime.find({}, function (err, docs) {
        if (err) {
          console.log(err.stack)
          return
        }
        if (!docs || docs.length === 0) {
          // There is nothing there yet. We don't bother adding it as we will also use a storex.
        } else {
          self.focusedTime = docs
          console.log('read focusedTime from DB')
        }
        self.$store.commit('createFocusedTime', self.focusedTime)
        console.log('created focused time in storex')
      })
    },
    destroyed () {
      document.removeEventListener('keydown', this.keyHandler)
    },
    filters: {
      pluralize: function (n) {
        return n === 1 ? 'task' : 'tasks'
      },
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString().toUpperCase()
        return value
      }
    },
    methods: {
      keyHandler: function (event) {
        event.stopImmediatePropagation()
        console.log('executing event listener to unset selection for key: ' + event.keyCode + '/meta: ' + event.metaKey)
        if (event.key === 'Escape' || event.keyCode === 27) {
          this.unsetSelectedTask()
        }
        if (event.keyCode === 70 && event.metaKey) { // meta+f for focus
          console.log('key f pressed for focus mode')
          if (this.selectedTask.name) {
            let t = this.selectedTask
            this.$router.push({name: 'focusTask', params: { task: t }})
          }
        }
        if (event.keyCode === 68 && event.metaKey) { // meta+d for duplicate
          console.log('key d pressed for duplication')
          if (this.selectedTask.name) {
            let t = this.selectedTask
            this.duplicateTask(t)
          }
        }
        if (event.keyCode === 80 && event.metaKey) { // meta+p for project expansion
          console.log('key p pressed for project expansion')
          if (this.selectedTask.name) {
            let t = this.selectedTask
            this.$store.commit('setPathFromRootToProjectExpanded', t.project)
          }
        }
        if (event.keyCode === 38 && event.metaKey && event.ctrlKey) { // ctrl+meta+up arrow for moving task up
          console.log('meta key up arrow pressed for task move up')
          if (this.selectedTask.name) {
            let t = this.selectedTask
            this.moveUpTask(t)
          }
        }
        if (event.keyCode === 40 && event.metaKey && event.ctrlKey) { // ctrl+meta+down for moving task down
          console.log('meta down arrow pressed for task move down')
          if (this.selectedTask.name) {
            let t = this.selectedTask
            this.moveDownTask(t)
          }
        }
        if (event.keyCode === 38 && !event.metaKey && !this.editingNote) { // up arrow for selecting previous task, make sure you're not editing the task
          console.log('up arrow pressed for select previous')
          if (this.selectedTask.name) {
            let t = this.selectedTask
            this.selectPreviousTask(t)
          } else {
            // if there is no task selected, select the last task in list on an up-arrow
            let t = this.findLastVisible()
            this.setSelectedTask(t)
          }
        }
        if (event.keyCode === 40 && !event.metaKey && !this.editingNote) { // down for selecting next task
          console.log('down arrow pressed for select next task')
          if (this.selectedTask.name) {
            let t = this.selectedTask
            this.selectNextTask(t)
          } else {
            // if there is no task selected, select the first task in list on an down-arrow
            let t = this.findFirstVisible()
            this.setSelectedTask(t)
          }
        }
      },
      searchFilter: function (task, textToSearch) {
        if (!textToSearch) {
          return true
        }
        let lSearch = textToSearch.toLowerCase()
        const mandatoryFieldsContains = task.name.toLowerCase().includes(lSearch) || task.projectName.toLowerCase().includes(lSearch) || task.when.includes(lSearch)
        if (mandatoryFieldsContains) {
          return mandatoryFieldsContains
        }
        if (task.note) {
          const optionalFieldsContains = task.note.toLowerCase().includes(lSearch)
          if (optionalFieldsContains) {
            return optionalFieldsContains
          }
        }
        let doneDay = this.$moment(task.done).format('YYYY-MM-DD hh:mma')
        return doneDay.includes(lSearch)
      },
      setActiveTab: function (tab) {
        this.$store.commit('setSelectedTaskTab', tab)
        this.unsetSelectedTask()
      },
      unsetSelectedTask: function () {
        this.selectedTask = {}
        this.$store.commit('unsetSelectedTaskId')
      },
      isTabActive: function (tab) {
        return this.activeTab === tab
      },
      addTask: function () {
        let taskName = this.newTaskText && this.newTaskText.trim()
        if (!taskName) {
          return
        }
        let newTask = {id: this.uuidv4(), name: taskName, project: this.selectedProject, projectName: this.selectedProjectName, when: this.activeTab, created: new Date()}
        // Set the order
        // The order where to add it is after the last order of this tab. For example, if last today item has index 6, we're adding at 7.
        const whereToAddIndex = this.findLastIndex(this.activeTab) + 1
        newTask.order = whereToAddIndex
        // Make sure all indices in this.tasks higher than whereToAddIndex are increased one (as we inserted this in between)
        this.insertIndex(whereToAddIndex)
        // Order has been set now just add it to the tasks so it can be displayed
        this.tasks.push(newTask)
        this.newTaskText = ''
        // Add it to the DB as well
        this.$taskDb.insert(newTask)
        // Expand the task tab corresponding to this task (open up someday if you add a someday task)
        this.setWhenStatusOpen(this.activeTab)
        this.setSelectedTask(newTask)
      },
      moveUpTask: function (task) {
        if (task.order === 1) {
          return // can't move up further
        }
        // One task up depends on the project selected and the filter applied.
        // Find the upper task to swap with in this project view
        let taskUpToSwap = this.findPreviousVisible(task)
        if (!taskUpToSwap) {
          return
        }

        let newOrder = taskUpToSwap.order

        if (task.when === 'thisweek') {
          let lastIndexToday = this.findLastIndexInToday()
          if (newOrder <= lastIndexToday) {
            return // can't move further up
          }
        }

        if (task.when === 'waitingfor') {
          let lastIndexThisWeek = this.findLastIndexInThisWeek()
          if (newOrder <= lastIndexThisWeek) {
            return // can't move further up
          }
        }

        if (task.when === 'someday') {
          let lastIndexThisWaitingFor = this.findLastIndexInWaitingFor()
          if (newOrder <= lastIndexThisWaitingFor) {
            return // can't move further up
          }
        }

        this.setSelectedTask(task)
        taskUpToSwap.order = task.order
        task.order = newOrder
        this.$taskDb.update({id: taskUpToSwap.id}, taskUpToSwap, {})
        this.$taskDb.update({id: task.id}, task, {})
      },
      selectPreviousTask: function (task) {
        let previousTask = this.findPreviousVisible(task)
        if (!previousTask) {
          return
        }
        this.setSelectedTask(previousTask)
      },
      selectNextTask: function (task) {
        let nextTask = this.findNextVisible(task)
        if (!nextTask) {
          return
        }
        this.setSelectedTask(nextTask)
        console.log('selected task: ' + this.selectedTask.name)
      },
      moveDownTask: function (task) {
        let taskDownToSwap = this.findNextVisible(task)

        if (!taskDownToSwap) {
          return
        }

        let newOrder = taskDownToSwap.order

        if (task.when === 'today') {
          let lastIndexToday = this.findLastIndexInToday()
          if (newOrder > lastIndexToday) {
            return // can't move further down
          }
        }

        if (task.when === 'thisweek') {
          let lastIndexThisWeek = this.findLastIndexInThisWeek()
          if (newOrder > lastIndexThisWeek) {
            return // can't move further down
          }
        }

        if (task.when === 'waitingfor') {
          let lastIndexThisWaitingFor = this.findLastIndexInWaitingFor()
          if (newOrder > lastIndexThisWaitingFor) {
            return // can't move further down
          }
        }

        if (task.when === 'someday') {
          let lastIndexSomeday = this.findLastIndexInSomeday()
          if (newOrder > lastIndexSomeday) {
            return // can't move further down
          }
        }

        this.setSelectedTask(task)
        taskDownToSwap.order = task.order
        task.order = newOrder
        this.$taskDb.update({id: taskDownToSwap.id}, taskDownToSwap, {})
        this.$taskDb.update({id: task.id}, task, {})
      },
      findFirstVisible: function () {
        let taskList = this.projectTasksFlat
        if (taskList.length > 0) {
          return taskList[0]
        }
      },
      findLastVisible: function () {
        let taskList = this.projectTasksFlat
        if (taskList.length > 0) {
          return taskList[taskList.length - 1]
        }
      },
      findPreviousVisible: function (task) {
        let previousTask
        // The project tasks are the visible tasks and are ordered
        this.projectTasksFlat.forEach(t => {
          if (t.order < task.order) {
            previousTask = t
          }
        })
        // returns undef if there is no previous visible (aka this is the first visible)
        return previousTask
      },
      findNextVisible: function (task) {
        let nextTask
        let nextTasks = this.projectTasksFlat.filter(t => t.order > task.order)

        if (nextTasks.length > 0) {
          nextTask = nextTasks[0]
        }
        return nextTask
      },
      findLastIndexInToday: function () {
        let maxIndex = 0
        this.tasks.forEach(t => {
          if (t.when === 'today' && t.order > maxIndex) {
            maxIndex = t.order
          }
        })
        return maxIndex
      },
      findLastIndexInThisWeek: function () {
        let maxIndex = this.findLastIndexInToday()
        this.tasks.forEach(t => {
          if (t.when === 'thisweek' && t.order > maxIndex) {
            maxIndex = t.order
          }
        })
        return maxIndex
      },
      findLastIndexInWaitingFor: function () {
        let maxIndex = this.findLastIndexInThisWeek()
        this.tasks.forEach(t => {
          if (t.when === 'waitingfor' && t.order > maxIndex) {
            maxIndex = t.order
          }
        })
        return maxIndex
      },
      findLastIndexInSomeday: function () {
        let maxIndex = this.findLastIndexInWaitingFor()
        this.tasks.forEach(t => {
          if (t.when === 'someday' && t.order > maxIndex) {
            maxIndex = t.order
          }
        })
        return maxIndex
      },
      findLastIndex: function (when) {
        if (when === 'today') {
          return this.findLastIndexInToday()
        }
        if (when === 'thisweek') {
          return this.findLastIndexInThisWeek()
        }
        if (when === 'waitingfor') {
          return this.findLastIndexInWaitingFor()
        }
        if (when === 'someday') {
          return this.findLastIndexInSomeday()
        }
        return 0
      },
      insertIndex: function (index) {
        this.tasks.forEach(t => {
          if (t.order >= index) {
            let newOrder = t.order + 1
            this.$set(t, 'order', newOrder)
            this.$taskDb.update({id: t.id}, {$set: {order: newOrder}}, {})
          }
        })
      },
      removeCompleted: function () {
        let projectsToConsiderForRemoval = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        let newTasks = []
        let ordersOfRemovedTasks = []
        this.tasks.forEach(task => {
          let keepTask = !projectsToConsiderForRemoval.includes(task.project) || !task.completed
          if (keepTask) {
            newTasks.push(task)
          } else {
            // Keep track of which orders have been removed
            ordersOfRemovedTasks.push(task.order)
            // Remove the task from the db
            this.$taskDb.remove({id: task.id})
          }
        })
        this.removeIndices(newTasks, ordersOfRemovedTasks)
        this.tasks = newTasks
      },
      archiveCompleted: function () {
        let projectsToConsiderForRemoval = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        let newTasks = []
        let ordersOfRemovedTasks = []
        this.tasks.forEach(task => {
          let keepTask = !projectsToConsiderForRemoval.includes(task.project) || !task.completed
          if (keepTask) {
            newTasks.push(task)
          } else {
            ordersOfRemovedTasks.push(task.order)
            this.$taskDb.remove({id: task.id})
            // Archive Task
            let archivedTask = Object.assign({}, task)
            archivedTask.done = new Date()
            this.$archivedTaskDb.insert(archivedTask)
          }
        })
        this.removeIndices(newTasks, ordersOfRemovedTasks)
        this.tasks = newTasks
      },
      removeIndices: function (tasks, indices) {
        if (indices.length > 0) {
          const firstIndex = indices[0]
          tasks.forEach(task => {
            if (task.order >= firstIndex) {
              task.order = task.order - 1
              this.$taskDb.update({id: task.id}, {$set: {order: task.order}}, {})
            }
          })
          // Remove first index, we're done with that one.
          indices.shift()
          // Depending on that firstIndex though the other indexes we have to remove have changed.
          // For example, if we before had to remove index 5, and 7, and we removed 5, then next up is index 6 (7-1) for removal.
          let newIndices = []
          indices.forEach(index => {
            if (index > firstIndex) {
              newIndices.push(index - 1)
            }
          })
          this.removeIndices(tasks, newIndices)
        }
      },
      setSelectedTask: function (task) {
        this.$store.commit('setEditingNote', false)
        this.$store.commit('setSelectedTaskId', task.id)
        this.selectedTask = task
      },
      duplicateTask: function (task) {
        let newTask = {}
        newTask.id = this.uuidv4()
        newTask.created = new Date()
        newTask.name = task.name
        newTask.due = task.due
        newTask.when = task.when
        newTask.note = task.note
        newTask.project = task.project
        newTask.projectName = task.projectName
        newTask.blocked = task.blocked

        let lastIndex = this.findLastIndex(task.when)
        newTask.order = lastIndex + 1
        this.insertIndex(newTask.order)

        this.tasks.push(newTask)
        this.$taskDb.insert(newTask)
        console.log('duplicated task')
      },
      setWhen: function (task, when) {
        // Remove it from its original:
        this.removeIndices(this.tasks, [task.order])
        // The index where the task need to move to (last one of the when tab)
        let newIndex = this.findLastIndex(when) + 1
        this.insertIndex(newIndex)
        this.setSelectedTask(task)
        task.when = when
        task.order = newIndex
        this.$taskDb.update({id: task.id}, task, {})
      },
      closeDetail: function (task) {
        this.unsetSelectedTask()
      },
      getWhenStatusExpandedIcon: function (when) {
        if (when === 'today' && this.todayStatus) {
          return 'caret-down'
        }
        if (when === 'today' && !this.todayStatus) {
          return 'caret-right'
        }
        if (when === 'thisweek' && this.thisWeekStatus) {
          return 'caret-down'
        }
        if (when === 'thisweek' && !this.thisWeekStatus) {
          return 'caret-right'
        }
        if (when === 'waitingfor' && this.waitingforStatus) {
          return 'caret-down'
        }
        if (when === 'waitingfor' && !this.waitingforStatus) {
          return 'caret-right'
        }
        if (when === 'someday' && this.somedayStatus) {
          return 'caret-down'
        }
        if (when === 'someday' && !this.somedayStatus) {
          return 'caret-right'
        }
      },
      setWhenStatus: function (when) {
        if (when === 'today') {
          this.$store.commit('setExpanded', {what: when, state: !this.todayStatus})
        }
        if (when === 'thisweek') {
          this.$store.commit('setExpanded', {what: when, state: !this.thisWeekStatus})
        }
        if (when === 'waitingfor') {
          this.$store.commit('setExpanded', {what: when, state: !this.waitingforStatus})
        }
        if (when === 'someday') {
          this.$store.commit('setExpanded', {what: when, state: !this.somedayStatus})
        }
      },
      setWhenStatusOpen: function (when) {
        this.$store.commit('setExpanded', {what: when, state: true})
      },
      // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
      uuidv4: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          let r = Math.random() * 16 | 0
          let v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }
    }
  }
</script>

<style scoped>

    .taskList {
        grid-area: taskList;
        display: flex;
        flex: 1 0 auto;
        height: 89vh;
    }

    /** 2 children of .tasklist **/
    .tasks {
        grid-area: tasks;
        display: grid;
        grid-template-rows: 20px 20px 20px 1fr;
        grid-template-columns: 1fr;
        grid-template-areas: "taskHeader"
                             "taskInput"
                             "removeTasksLine"
    "theSelectableTaskList";
        grid-row-gap: 10px;
        width: 100%;
    }

    .tasksLarge {
        display: grid;
        grid-template-rows: 20px 20px 20px 1fr;
        grid-template-columns: 1fr;
        grid-template-areas: "taskHeader"
        "taskInput"
        "removeTasksLine"
        "theSelectableTaskList";
        grid-row-gap: 10px;
        width: 100%;
    }

    .taskHeader {
        grid-area: taskHeader;
    }

    .taskInput {
      grid-area: taskInput;
        width: 500px;
    }


    .theSelectableTaskList {
        grid-area: theSelectableTaskList;
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
        height: 78vh;
    }

    .taskListDivisions {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-shrink: 0;
        height: 40vh;
    }

    .taskListDivisionsLarge {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-shrink: 0;
        width: 100%;
        height: 78vh;
    }

    .todayList {
        grid-area: todayList;
        display: grid;
        grid-template-rows: 20px 1fr;
        grid-template-columns: 10px 1fr;
        grid-template-areas: "caretIcon taskTab"
        ". tasksInTab";
    }

    .caretIcon {
        grid-area: caretIcon;
    }

    .tasksInTab {
        grid-area: tasksInTab;
    }

    .thisweekList {
        margin-top: 10px;
        grid-area: thisweekList;
        display: grid;
        grid-template-rows: 20px 1fr;
        grid-template-columns: 10px 1fr;
        grid-template-areas: "caretIcon taskTab"
        ". tasksInTab";
    }

    .focusToday {
        color: gray;
        text-decoration: none !important;
        padding-right: 0px;
        display: inline-block;
        margin-left: 10px;
        cursor: default;
    }

    .waitingforList {
        margin-top: 10px;
        grid-area: waitingforList;
        display: grid;
        grid-template-rows: 20px 1fr;
        grid-template-columns: 10px 1fr;
        grid-template-areas: "caretIcon taskTab"
        ". tasksInTab";    }

    .somedayList {
        margin-top: 10px;
        grid-area: somedayList;
        display: grid;
        grid-template-rows: 20px 1fr;
        grid-template-columns: 10px 1fr;
        grid-template-areas: "caretIcon taskTab"
        ". tasksInTab";
    }

    .taskTab {
        text-decoration: underline;
        cursor:pointer;
        padding-right: 5px;
    }

    .is-active {
        text-decoration: underline;
        cursor:pointer;
        color: forestgreen;
    }

    .removeTasksLine {
        grid-area: removeTasksLine;
        grid-area: removeTasksLine;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 250px 250px 1fr;
        grid-template-areas: "archiveTasks removeTasks ."
    }

    .removeTasks {
        grid-area: removeTasks;
        justify-self: end;
    }

    .archiveTasks {
        grid-area: archiveTasks;
        justify-self:start;
    }

    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
    }

    input {
        font: inherit;
    }

    input:focus {
        outline-color: #4AD94A;
    }

    input::selection {
        background-color: #4AD94A;
    }

    button {
        background-color: forestgreen;
        outline: 0;
        border: none;
        color: white;
        font-family: 'Roboto Mono';
        font-style: normal;
        font-weight: 500;
        width: 150px;
        height: 25px;
        line-height: 25px;
        text-transform: uppercase;
        border-radius: 2px;
        text-align: center;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: .3s ease-out;
        font-size: 12px;
    }

    button.removeTasks {
        background-color: darkslategrey;
        outline: 0;
        border: none;
        color: white;
        font-family: 'Roboto Mono';
        font-style: normal;
        font-weight: 500;
        width: 150px;
        height: 25px;
        line-height: 25px;
        text-transform: uppercase;
        border-radius: 2px;
        text-align: center;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: .3s ease-out;
        font-size: 12px;
    }

</style>

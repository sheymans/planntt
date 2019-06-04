<template>
    <div class="taskList">
        <div class="tasks">
            <div class="taskHeader">
                    <b>{{selectedProjectName | capitalize}} ({{numberOfProjectTasks}})</b>
            </div>
            <input class="taskInput"
                   autofocus autocomplete="off"
                   placeholder="Filter tasks/press enter to add a new task"
                   v-model="newTaskText"
                   @keyup.enter="addTask">

            <div class="theSelectableTaskList">
                <div class="todayList">
                    <font-awesome-icon class="caretIcon" @click="setWhenStatus('today')" :icon="getWhenStatusExpandedIcon('today')"/>
                    <a :class="{'is-active': isTabActive('today')}" class="taskTab" @click="setActiveTab('today')">today ({{projectTasks['today'].length}})</a>
                    <div class="tasksInTab" v-if="projectTasks['today'].length && todayStatus">
                        <Task v-for="task in projectTasks['today']"
                              :key="task.id"
                              @setSelectedTask="setSelectedTask"
                              :task="task"/>
                    </div>
                </div>
                <div class="thisweekList">
                    <font-awesome-icon class="caretIcon"  @click="setWhenStatus('thisweek')" :icon="getWhenStatusExpandedIcon('thisweek')"/>
                    <a :class="{'is-active': isTabActive('thisweek')}" class="taskTab" @click="setActiveTab('thisweek')">this week ({{projectTasks['thisweek'].length}})</a>
                    <div class="tasksInTab"  v-if="projectTasks['thisweek'].length && thisWeekStatus">
                        <Task v-for="task in projectTasks['thisweek']"
                              :key="task.id"
                              @setSelectedTask="setSelectedTask"
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
                              :task="task"/>
                    </div>
                </div>
            </div>

            <div class="removeTasksLine">
                <button v-show="numberOfCompletedProjectTasks > 0" class="archiveTasks" @click="archiveCompleted">
                    mark done
                </button>
                <button v-show="numberOfCompletedProjectTasks > 0" class="removeTasks" @click="removeCompleted">
                    remove selected
                </button>
            </div>
        </div>

        <TaskDetail :task="selectedTask" @duplicateTask="duplicateTask"/>
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
        selectedTask: {}
      }
    },
    computed: {
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
        let projectsToConsider = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        let allTasksToShow = this.tasks.filter(task => projectsToConsider.includes(task.project))

        let mapOfTasksPerWhen = {'today': [], 'thisweek': [], 'waitingfor': [], 'someday': []}

        // Sort with oldest created on top
        allTasksToShow.sort((a, b) => {
          if (a.created && b.created) {
            return a.created - b.created
          }
          if (a.created) {
            return 1
          }
          return -1
        })

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
        this.tasks.push(newTask)
        this.newTaskText = ''
        // Add it to the DB as well
        this.$taskDb.insert(newTask)
        // Expand the task tab corresponding to this task (open up someday if you add a someday task)
        this.setWhenStatusOpen(this.activeTab)
        this.setSelectedTask(newTask)
      },
      removeCompleted: function () {
        let projectsToConsiderForRemoval = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        let newTasks = []
        this.tasks.forEach(task => {
          let keepTask = !projectsToConsiderForRemoval.includes(task.project) || !task.completed
          if (keepTask) {
            newTasks.push(task)
          } else {
            this.$taskDb.remove({id: task.id})
          }
        })
        this.tasks = newTasks
      },
      archiveCompleted: function () {
        let projectsToConsiderForRemoval = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        let newTasks = []
        this.tasks.forEach(task => {
          let keepTask = !projectsToConsiderForRemoval.includes(task.project) || !task.completed
          if (keepTask) {
            newTasks.push(task)
          } else {
            this.$taskDb.remove({id: task.id})
            // Archive Task
            let archivedTask = Object.assign({}, task)
            archivedTask.done = new Date()
            this.$archivedTaskDb.insert(archivedTask)
          }
        })
        this.tasks = newTasks
      },
      setSelectedTask: function (task) {
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
        this.tasks.push(newTask)
        this.$taskDb.insert(newTask)
        console.log('duplicated task')
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
        display: grid;
        grid-template-columns: 1fr;
        grid-template-areas: "tasks"
                             "taskDetail";
        grid-row-gap: 50px;
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
        height: 50vh;
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
        overflow: auto;
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
        outline-color: chartreuse;
    }

    input::selection {
        background-color: chartreuse;
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
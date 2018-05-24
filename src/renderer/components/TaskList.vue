<template>
    <div class="taskList">
        <div class="tasks">
            <div class="taskHeader">
                    <b>{{selectedProjectName | capitalize}} ({{numberOfProjectTasks}})</b>
            </div>
            <input class="taskInput"
                   autofocus autocomplete="off"
                   placeholder="Add a task to this project"
                   v-model="newTaskText"
                   @keyup.enter="addTask">

            <div class="theSelectableTaskList">
                <div class="todayList">
                    <font-awesome-icon class="caretIcon" @click="setWhenStatus('today')" :icon="getWhenStatusExpandedIcon('today')"/>
                    <a :class="{'is-active': isTabActive('today')}" class="taskTab" @click="setActiveTab('today')">today</a>
                    <div class="tasksInTab" v-if="projectTasks['today'].length && todayStatus">
                        <Task v-for="task in projectTasks['today']"
                              :key="task.id"
                              :task="task"/>
                    </div>
                </div>
                <div class="thisweekList">
                    <font-awesome-icon class="caretIcon"  @click="setWhenStatus('thisweek')" :icon="getWhenStatusExpandedIcon('thisweek')"/>
                    <a :class="{'is-active': isTabActive('thisweek')}" class="taskTab" @click="setActiveTab('thisweek')">this week</a>
                    <div class="tasksInTab"  v-if="projectTasks['thisweek'].length && thisWeekStatus">
                        <Task v-for="task in projectTasks['thisweek']"
                              :key="task.id"
                              :task="task"/>
                    </div>
                </div>

                <div class="waitingforList">
                    <font-awesome-icon class="caretIcon"  @click="setWhenStatus('waitingfor')" :icon="getWhenStatusExpandedIcon('waitingfor')"/>
                    <a :class="{'is-active': isTabActive('waitingfor')}" class="taskTab" @click="setActiveTab('waitingfor')">waiting for</a>
                    <div class="tasksInTab" v-if="projectTasks['waitingfor'].length && waitingforStatus">
                        <Task v-for="task in projectTasks['waitingfor']"
                              :key="task.id"
                              :task="task"/>
                    </div>
                </div>

                <div class="somedayList">
                    <font-awesome-icon class="caretIcon"  @click="setWhenStatus('someday')" :icon="getWhenStatusExpandedIcon('someday')"/>
                    <a :class="{'is-active': isTabActive('someday')}" class="taskTab" @click="setActiveTab('someday')">someday</a>
                    <div class="tasksInTab" v-if="projectTasks['someday'].length && somedayStatus">
                        <Task v-for="task in projectTasks['someday']"
                              :key="task.id"
                              :task="task"/>
                    </div>
                </div>
            </div>

            <div v-show="numberOfCompletedProjectTasks > 0" class="removeTasks" @click="removeCompleted">
                remove marked
            </div>
        </div>

        <TaskDetail @updateTask="updateTask" :task="selectedTask"/>
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
        activeTab: 'someday',
        todayStatus: false,
        thisWeekStatus: false,
        waitingforStatus: false,
        somedayStatus: false
      }
    },
    computed: {
      projectTasks: function () {
        // Clean up tasks (set as INBOX project if the project is gone)
        let deletedProjects = this.$store.getters.getDeletedProjects
        this.tasks.forEach(task => {
          if (deletedProjects.includes(task.project)) {
            console.log('set project of task with id' + task.id + ' to INBOX')
            task.project = 1
            // Update DB
            this.$taskDb.update({id: task.id}, { $set: { project: task.project } }, {})
          }
        })
        let projectsToConsider = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        let allTasksToShow = this.tasks.filter(task => projectsToConsider.includes(task.project))

        let mapOfTasksPerWhen = {'today': [], 'thisweek': [], 'waitingfor': [], 'someday': []}

        mapOfTasksPerWhen['today'] = allTasksToShow.filter(t => t.when === 'today')
        mapOfTasksPerWhen['thisweek'] = allTasksToShow.filter(t => t.when === 'thisweek')
        mapOfTasksPerWhen['waitingfor'] = allTasksToShow.filter(t => t.when === 'waitingfor')
        mapOfTasksPerWhen['someday'] = allTasksToShow.filter(t => t.when === 'someday')
        return mapOfTasksPerWhen
      },
      selectedProject: function () {
        return this.$store.getters.getSelectedProject
      },
      selectedProjectName: function () {
        return this.$store.getters.getSelectedProjectName
      },
      selectedTask: function () {
        return Object.assign({}, this.$store.getters.getSelectedTask)
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
      setActiveTab: function (tab) {
        this.activeTab = tab
        this.unsetSelectedTask()
        this.setWhenStatus(tab)
      },
      unsetSelectedTask: function () {
        this.$store.commit('setSelectedTask', {})
      },
      isTabActive: function (tab) {
        return this.activeTab === tab
      },
      addTask: function () {
        let taskName = this.newTaskText && this.newTaskText.trim()
        if (!taskName) {
          return
        }
        let newTask = {id: this.uuidv4(), name: taskName, project: this.selectedProject, projectName: this.selectedProjectName, when: this.activeTab}
        this.tasks.push(newTask)
        this.newTaskText = ''
        // Add it to the DB as well
        this.$taskDb.insert(newTask)
      },
      removeCompleted: function () {
        let projectsToConsiderForRemoval = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        let selectedTask = this.$store.getters.getSelectedTask
        let newTasks = []
        this.tasks.forEach(task => {
          let keepTask = !projectsToConsiderForRemoval.includes(task.project) || !task.completed
          if (keepTask) {
            newTasks.push(task)
          } else {
            this.$taskDb.remove(task)
            // Also remove selected task if it is no longer in newTasks (in other words the selected task was removed)
            if (selectedTask.id === task.id) {
              this.unsetSelectedTask()
            }
          }
        })
        this.tasks = newTasks
      },
      updateTask: function (task) {
        // First find the task to update in the task list
        let index = this.tasks.findIndex(t => {
          return t.id === task.id
        })
        // Use set rather than updating the array index to actually see the value
        this.$set(this.tasks, index, task)
        console.log('updated task in task list, new task is now ' + JSON.stringify(task))
        // Also update the task database
        this.$taskDb.update({id: task.id}, task, {})
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
          this.todayStatus = !this.todayStatus
        }
        if (when === 'thisweek') {
          this.thisWeekStatus = !this.thisWeekStatus
        }
        if (when === 'waitingfor') {
          this.waitingforStatus = !this.waitingforStatus
        }
        if (when === 'someday') {
          this.somedayStatus = !this.somedayStatus
        }
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
        grid-template-rows: 1fr 0.68fr;
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
                            "removeTasks"
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

    .removeTasks {
        cursor:pointer;
        color: forestgreen;
        text-decoration: underline;
        grid-area: removeTasks;
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

</style>
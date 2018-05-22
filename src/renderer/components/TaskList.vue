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
            <div class="taskTabs">
                <a :class="{'is-active': isTabActive('all')}" class="taskTab" @click="setActiveTab('all')">all</a>
                <a :class="{'is-active': isTabActive('today')}" class="taskTab" @click="setActiveTab('today')">today</a>
                <a :class="{'is-active': isTabActive('thisweek')}" class="taskTab" @click="setActiveTab('thisweek')">this week</a>
                <a :class="{'is-active': isTabActive('waitingfor')}" class="taskTab" @click="setActiveTab('waitingfor')">waiting for</a>
                <a :class="{'is-active': isTabActive('someday')}" class="taskTab" @click="setActiveTab('someday')">someday</a>
            </div>

            <div class="theSelectableTaskList">
                <div v-if="projectTasks.length">
                    <Task v-for="task in projectTasks"
                          :key="task.id"
                          :task="task"/>
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

  export default {
    name: 'TaskList',
    components: {
      TaskDetail,
      Task
    },
    data () {
      return {
        newTaskText: '',
        tasks: [],
        activeTab: 'all'
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
        if (this.activeTab === 'all') {
          return allTasksToShow
        } else if (this.activeTab === 'today') {
          return allTasksToShow.filter(t => t.when === 'today')
        } else if (this.activeTab === 'thisweek') {
          return allTasksToShow.filter(t => t.when === 'thisweek')
        } else if (this.activeTab === 'waitingfor') {
          return allTasksToShow.filter(t => t.when === 'waitingfor')
        } else if (this.activeTab === 'someday') {
          return allTasksToShow.filter(t => t.when === 'someday')
        }
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
          let completedTasks = this.projectTasks.filter(t => t.completed)
          return completedTasks.length
        } else {
          return 0
        }
      },
      numberOfProjectTasks: function () {
        if (this.projectTasks) {
          return this.projectTasks.length
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
        grid-template-rows: 20px 20px 20px 20px 1fr;
        grid-template-columns: 1fr;
        grid-template-areas: "taskHeader"
                            "taskInput"
                            "taskTabs"
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

    .taskTabs {
        grid-area: taskTabs;
    }

    .theSelectableTaskList {
        grid-area: theSelectableTaskList;
        overflow: auto;
        display: grid;
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
<template>
    <div class="columns">
        <div class="column">
            <nav class="panel">
                <p class="panel-heading">
                    {{numberOfProjectTasks}} {{numberOfProjectTasks | pluralize }} in <b>{{selectedProjectName}}</b>
                </p>
                <div class="panel-block">
                    <input class="input is-rounded"
                           autofocus autocomplete="off"
                           placeholder="Add a task to this project"
                           v-model="newTaskText"
                           @keyup.enter="addTask">
                </div>
                <p class="panel-tabs">
                    <a :class="{'is-active': isTabActive('all')}" @click="setActiveTab('all')">all</a>
                    <a :class="{'is-active': isTabActive('today')}" @click="setActiveTab('today')">today</a>
                    <a :class="{'is-active': isTabActive('thisweek')}" @click="setActiveTab('thisweek')">this week</a>
                    <a :class="{'is-active': isTabActive('waitingfor')}" @click="setActiveTab('waitingfor')">waiting for</a>
                    <a :class="{'is-active': isTabActive('someday')}" @click="setActiveTab('someday')">someday</a>
                </p>
                <div v-if="projectTasks.length">
                    <Task v-for="task in projectTasks"
                          :key="task.id"
                          :task="task"/>
                </div>
                <a class="panel-block" v-if="!projectTasks.length">
                    no tasks in this project
                </a>
                <div v-show="numberOfCompletedProjectTasks > 0" class="panel-block">
                    <button class="button is-link is-outlined is-fullwidth" @click="removeCompleted">
                        remove completed
                    </button>
                </div>
            </nav>
        </div>
        <div class="column">
            <TaskDetail @updateTask="updateTask" :task="selectedTask"/>
        </div>
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
        let newTasks = []
        this.tasks.forEach(task => {
          let keepTask = !projectsToConsiderForRemoval.includes(task.project) || !task.completed
          if (keepTask) {
            newTasks.push(task)
          } else {
            this.$taskDb.remove(task)
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
    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
    }

</style>
<template>
    <nav class="panel">
        <p class="panel-heading">
            tasks
        </p>
        <div class="panel-block">
            <input class="input is-rounded"
                   autofocus autocomplete="off"
                   placeholder="Add a task to this project"
                   v-model="newTaskText"
                   @keyup.enter="addTask">
        </div>
        <p class="panel-tabs">
            <a class="is-active">all</a>
            <a>today</a>
            <a>this week</a>
            <a>waiting for</a>
        </p>
        <div v-if="projectTasks.length">
            <Task v-for="task in projectTasks"
                  :key="task.id"
                  :task="task"/>
        </div>
        <a class="panel-block" v-if="!projectTasks.length">
            no tasks in this project
        </a>
        <div class="panel-block">
            <button class="button is-link is-outlined is-fullwidth" @click="removeCompleted">
                remove completed
            </button>
        </div>
    </nav>
</template>

<script>
  import Task from './Task.vue'

  export default {
    name: 'TaskList',
    components: {
      Task
    },
    data () {
      return {
        newTaskText: '',
        tasks: []
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
          }
        })
        let projectsToConsider = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        return this.tasks.filter(task => projectsToConsider.includes(task.project))
      },
      selectedProject: function () {
        return this.$store.getters.getSelectedProject
      }
    },
    methods: {
      addTask: function () {
        let taskName = this.newTaskText && this.newTaskText.trim()
        if (!taskName) {
          return
        }
        let newTask = {id: this.uuidv4(), name: taskName, project: this.selectedProject}
        this.tasks.push(newTask)
        this.newTaskText = ''
      },
      removeCompleted: function () {
        let projectsToConsiderForRemoval = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        this.tasks = this.tasks.filter(task => !projectsToConsiderForRemoval.includes(task.project) || !task.completed)
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
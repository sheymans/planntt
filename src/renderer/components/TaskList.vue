<template>
    <div>
        <input
               autofocus autocomplete="off"
               placeholder="Add a task to this project"
               v-model="newTaskText"
               @keyup.enter="addTask">
        <ul v-if="projectTasks.length">
            <Task
                    v-for="task in projectTasks"
                    :key="task.id"
                    :task="task"/>
        </ul>
        <div v-if="!projectTasks.length">No tasks in this project.</div>
    </div>
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
        let projectsToConsider = this.$store.getters.getStoredDescendantProjectIdsOfSelected
        return this.tasks.filter(task => projectsToConsider.includes(task.project))
      }
    },
    methods: {
      addTask: function () {
        let taskName = this.newTaskText && this.newTaskText.trim()
        if (!taskName) {
          return
        }
        let currentlySelectedProject = this.$store.getters.getSelectedProject
        let newTask = {id: this.uuidv4(), name: taskName, project: currentlySelectedProject}
        this.tasks.push(newTask)
        this.newTaskText = ''
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
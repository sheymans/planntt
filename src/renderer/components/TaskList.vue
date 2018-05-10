<template>
    <div>
        <ul v-if="tasks.length">
            <Task
                    v-for="task in tasks"
                    :key="task.id"
                    :project="task"/>
        </ul>
        <div v-if="!tasks.length">No tasks in this project. Right-click on the project to add a task.</div>
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
        tasks: []
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
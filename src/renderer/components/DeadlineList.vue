<template>
    <div class="deadlineList">
        <div class="deadlineTasks">
            <DeadlineTask v-for="task in tasks"
                          :key="task.id"
                          :task="task"/>
        </div>
    </div>
</template>

<script>
import DeadlineTask from './DeadlineTask.vue'

export default {
  name: 'DeadlineList',
  components: {
    DeadlineTask
  },
  data () {
    return {
      tasks: [],
      selectedTask: {}
    }
  },
  created () {
    // Load the data (note we need the self, cause of the callback scope; we could try using an arrow function here)
    const self = this
    this.$taskDb.find({}, function (err, docs) {
      if (err) {
        console.log(err.stack)
        return
      }
      if (docs && docs.length > 0) {
        self.tasks = docs.filter(t => t.due)
        // Sort tasks by *due* date (latest first):
        self.tasks.sort((a, b) => {
          return a.due - b.due
        })
        console.log('read deadline task list from db')
      }
    })
  }
}
</script>

<style scoped>

    .deadlineList {
        grid-area: deadlineList;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-areas: "deadlineTasks"
    }

    .deadlineTasks {
        height: 80vh;
        overflow: auto;
    }

</style>

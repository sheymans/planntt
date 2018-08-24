<template>
    <div class="archiveList">
        <div class="archiveTasks">
            <ArchivedTask v-for="task in tasks"
                          :key="task.id"
                          @setSelectedTask="setSelectedTask"
                          :task="task"/>
        </div>
        <ArchivedTaskDetail :task="selectedTask"/>
    </div>
</template>

<script>
  import ArchivedTask from './ArchivedTask.vue'
  import ArchivedTaskDetail from './ArchivedTaskDetail.vue'

  export default {
    name: 'ArchiveList',
    components: {
      ArchivedTask,
      ArchivedTaskDetail
    },
    data () {
      return {
        tasks: [],
        selectedTask: {}
      }
    },
    created () {
      // Load the data (note we need the self, cause of the callback scope; we could try using an arrow function here)
      let self = this
      this.$archivedTaskDb.find({}, function (err, docs) {
        if (err) {
          console.log(err.stack)
          return
        }
        if (docs && docs.length > 0) {
          self.tasks = docs
          // Sort tasks by date (latest first):
          self.tasks.sort((a, b) => {
            return b.done - a.done
          })
          console.log('read archived task list from db')
        }
      })
    },
    methods: {
      setSelectedTask: function (task) {
        this.selectedTask = task
      }
    }
  }
</script>

<style scoped>

    .archiveList {
        grid-area: archiveList;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-areas: "archiveTasks"
        "taskDetail";
        grid-row-gap: 50px;
    }

    .archiveTasks {
        height: 70vh;
        overflow: auto;
    }

</style>
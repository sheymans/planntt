<template>
    <div class="archiveList">
        <ArchivedTask v-for="task in tasks"
              :key="task.id"
              :task="task"/>
    </div>
</template>

<script>
  import ArchivedTask from './ArchivedTask.vue'

  export default {
    name: 'ArchiveList',
    components: {
      ArchivedTask
    },
    data () {
      return {
        tasks: []
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
    }
  }
</script>

<style scoped>

    .archiveList {
        grid-area: archiveList;
    }

</style>
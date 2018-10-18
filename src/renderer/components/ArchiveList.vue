<template>
    <div class="archiveList">
        <input class="searchInput"
               autofocus autocomplete="off"
               placeholder="filter the archive"
               v-model="searchText">
        <div class="archiveTasks">
            <ArchivedTask v-for="task in searchedTasks"
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
        selectedTask: {},
        searchText: ''
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
    },
    computed: {
      searchedTasks: function () {
        let self = this
        const tasksToShow = this.tasks.filter(task => {
          const mandatoryFieldsContains = task.name.includes(self.searchText) || task.projectName.includes(self.searchText) || task.when.includes(self.searchText)
          if (mandatoryFieldsContains) {
            return mandatoryFieldsContains
          }
          if (task.note) {
            const optionalFieldsContains = task.note.includes(self.searchText)
            if (optionalFieldsContains) {
              return optionalFieldsContains
            }
          }
          let doneDay = this.$moment(task.done).format('YYYY-MM-DD hh:mma')
          return doneDay.includes(self.searchText)
        })
        return tasksToShow
      }
    }
  }
</script>

<style scoped>

    .archiveList {
        grid-area: archiveList;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-areas:
                "searchInput"
                "archiveTasks"
        "taskDetail";
        grid-row-gap: 50px;
    }

    .archiveTasks {
        height: 70vh;
        overflow: auto;
    }

    .searchInput {
        grid-area: searchInput;
        width: 500px;
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
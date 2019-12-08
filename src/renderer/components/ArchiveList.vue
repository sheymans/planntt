<template>
    <div class="archiveList">
        <div class="archiveHeader">
            <b>Archive ({{numberOfArchivedTasks}})</b>
        </div>
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
        let lSearch = self.searchText.toLowerCase()
        const tasksToShow = this.tasks.filter(task => {
          const mandatoryFieldsContains = task.name.toLowerCase().includes(lSearch) || task.projectName.toLowerCase().includes(lSearch) || task.when.includes(lSearch)
          if (mandatoryFieldsContains) {
            return mandatoryFieldsContains
          }
          if (task.note) {
            const optionalFieldsContains = task.note.toLowerCase().includes(lSearch)
            if (optionalFieldsContains) {
              return optionalFieldsContains
            }
          }
          let doneDay = this.$moment(task.done).format('YYYY-MM-DD hh:mma')
          return doneDay.includes(lSearch)
        })
        return tasksToShow
      },
      numberOfArchivedTasks: function () {
        return this.searchedTasks.length
      }
    }
  }
</script>

<style scoped>

    .archiveList {
        grid-area: archiveList;
        display: grid;
        grid-template-rows: 20px 20px 1fr;
        grid-template-columns: 1fr;
        grid-template-areas:
                "archiveHeader"
                "searchInput"
                "archiveTasks"
        "taskDetail";
        grid-row-gap: 20px;
    }

    .archiveTasks {
        height: 60vh;
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
        outline-color: #4AD94A;
    }

    input::selection {
        background-color: #4AD94A;
    }

</style>
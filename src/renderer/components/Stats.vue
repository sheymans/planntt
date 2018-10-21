<template>
    <div id="mainPage">
        <div class="header">
            <img class="logo" id="logo" src="~@/assets/planntt.png" alt="planntt">
            <router-link class="home" to="/">Projects</router-link>
            <router-link class="deadlines" to="/deadlines">Deadlines</router-link>
            <router-link class="archive" to="/archive">Archive</router-link>
            <router-link class="stats" to="/stats">Stats</router-link>
        </div>
        <div class="content">
            <div class="statsList">
            <div class="statsHeader">
                <b>Tasks Completed Per Day</b>
            </div>
            <div class="tasksCompletedPerDay" id="done-tasks-per-day"></div>
            </div>
        </div>
    </div>
</template>

<script>
  import Planntt from '../App'
  import muze from 'muze'

  export default {
    name: 'Stats',
    components: {
      Planntt
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
          console.log('read archived task list from db for stats')
          // Now group by done day:
          // Count by day:
          let countTasksByDay = []
          self.tasks.forEach(task => {
            const doneDay = self.$moment(task.done).format('YYYY-MM-DD')
            countTasksByDay.push({done: doneDay, count: 1})
          })

          const DataModel = muze.DataModel
          const schema = [
            {
              name: 'done', // Name of the variable
              type: 'dimension', // Date time is a dimension
              subtype: 'temporal', // Subtype is temporal by which DataModel understands its a datetime variable
              format: '%Y-%m-%d'
            },
            {
              name: 'count',
              type: 'measure'
            }
          ]
          const dm = new DataModel(countTasksByDay, schema)
          const groupBy = DataModel.Operators.groupBy
          const groupedFn = groupBy(['done'], {count: 'count'})
          const outputDM = groupedFn(dm)
          const env = muze()
          const canvas = env.canvas()

          canvas
            .data(outputDM)
            .width(600)
            .height(400)
            .rows(['count']) /* Gets plotted on y-axis */
            .columns(['done']) /* Gets plotted on x-axis */
            .mount('#done-tasks-per-day') /* Attaching the canvas to DOM element */
        }
      })
    },
    methods: {},
    computed: {
      totalDoneTasks: function () {
        return this.tasks.length
      }
    }
  }
</script>

<style scoped>

    #mainPage {
        font-family: 'Raleway';
        font-style: normal;
        font-weight: 500;
        font-size: 10pt;
        -webkit-font-smoothing: antialiased;
    }

    .header {
        display: grid;
        grid-area: header;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr 60px 70px 60px 60px;
        grid-template-areas: "logo home deadlines archive stats";
    }

    .logo {
        grid-area: logo
    }

    .home {
        grid-area: home;
        text-decoration: underline;
        color: black;
    }

    .archive {
        grid-area: archive;
        text-decoration: underline;
        color: black;
    }

    .deadlines {
        grid-area: deadlines;
        text-decoration: underline;
        color: black;
    }

    .stats {
        grid-area: stats;
        text-decoration: underline;
        color: forestgreen;
    }

    .content {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 200px 1fr;
        grid-template-areas: ".   statsList";
    }

    .statsList {
        grid-area: statsList;
        display: grid;
        grid-template-rows: 100px 1fr;
        grid-template-areas: "statsHeader"
                             "tasksCompletedPerDay";
    }

    .statsHeader {
        grid-area: statsHeader;
    }

    .tasksCompletedPerDay {
        grid-area: tasksCompletedPerDay;
    }

    #logo {
        width: 80px;
        height: auto;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-top: 10px;
    }

</style>
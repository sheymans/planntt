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
            <div class="statsOverview">
                <ul>
                    <li :class="{'is-active': statsType === 'allCompletedTasksPerDay'}" class="statsChoice" @click="tasksCompletedPerDay">completed tasks/day</li>
                    <li :class="{'is-active': statsType === 'allCompletedTasksPerWeek'}" class="statsChoice" @click="tasksCompletedPerWeek">completed tasks/week</li>
                    <li :class="{'is-active': statsType === 'allCompletedTasksPerMonth'}" class="statsChoice" @click="tasksCompletedPerMonth">completed tasks/month</li>
                    <li :class="{'is-active': statsType === 'allCompletedTasksPerMinute'}" class="statsChoice" @click="tasksCompletedPerMinute">productive minutes</li>
                    <li :class="{'is-active': statsType === 'allCompletedTasksPerHour'}" class="statsChoice" @click="tasksCompletedPerHour">productive hours</li>
                    <li :class="{'is-active': statsType === 'allCompletedTasksPerDayOfWeek'}" class="statsChoice" @click="tasksCompletedPerDayOfWeek">productive days</li>
                </ul>
            </div>
            <div class="statsList">
            <div class="statsHeader">
            </div>
            <div class="canvasStats" id="canvasStats"></div>
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
        tasks: [],
        statsType: 'allCompletedTasksPerDay'
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
          // Always initialize tasks completed per day
          self.tasksCompletedPerDay()
        }
      })
    },
    methods: {
      tasksCompletedPer: function (momentFormat) {
        // Now group by format, for example, by day 'YYYY-MM-DD':
        // Count by day:
        let countTasksBy = []
        this.tasks.forEach(task => {
          const doneDay = this.$moment(task.done).format(momentFormat)
          countTasksBy.push({date: doneDay, count: 1})
        })

        const DataModel = muze.DataModel
        const schema = [
          {
            name: 'date', // Name of the variable
            type: 'dimension' // Date time is a dimension
          },
          {
            name: 'count',
            type: 'measure'
          }
        ]
        const dm = new DataModel(countTasksBy, schema)
        const groupBy = DataModel.Operators.groupBy
        const groupedFn = groupBy(['date'], {count: 'count'})
        const outputDM = groupedFn(dm).sort([['date', 'ASC']])
        const env = muze()
        const canvas = env.canvas()
        const html = muze.Operators.html

        canvas
          .data(outputDM)
          .width(700)
          .height(500)
          .rows(['count']) /* Gets plotted on y-axis */
          .columns(['date']) /* Gets plotted on x-axis */
          .config({
            autoGroupBy: { disabled: true },
            gridLines: {
              y: { show: true }
            },
            border: {
              showValueBorders: { left: false, bottom: false }
            },
            axes: {
              y: {
                showAxisName: false
              },
              x: {
                tickFormat: val => {
                  if (momentFormat === 'E') {
                    return this.$moment().weekday(val).format('ddd')
                  }
                  if (momentFormat === 'HH:mm') {
                    return ''
                  }
                  return val
                },
                showInnerTicks: true,
                showAxisName: false
              }
            },
            interaction: {
              tooltip: {
                formatter: (dataModel, context) => {
                  const tooltipData = dataModel.getData().data
                  const fieldConfig = dataModel.getFieldsConfig()

                  let tooltipContent = ''
                  tooltipData.forEach((dataArray, i) => {
                    const datePoint = dataArray[fieldConfig.date.index]
                    const countPoint = dataArray[fieldConfig.count.index]

                    if (momentFormat === 'YYYY-MM-WW') {
                      const week = datePoint.substring(datePoint.length - 2, datePoint.length)
                      tooltipContent += `${countPoint} in week ${week}`
                    } else if (momentFormat === 'HH:mm') {
                      tooltipContent += `${countPoint} at ${datePoint}`
                    } else if (momentFormat === 'HH') {
                      tooltipContent += `${countPoint} at ${datePoint}h`
                    } else if (momentFormat === 'E') {
                      const day = this.$moment().weekday(datePoint).format('ddd')
                      tooltipContent += `${countPoint} on ${day}`
                    } else {
                      tooltipContent += `${countPoint} on ${datePoint}`
                    }
                  })
                  return html`${tooltipContent}`
                }
              }
            },
            legend: {
              size: { show: false }
            }
          })
          .mount('#canvasStats') /* Attaching the canvas to DOM element */
      },
      tasksCompletedPerDay: function () {
        this.statsType = 'allCompletedTasksPerDay'
        this.tasksCompletedPer('YYYY-MM-DD')
      },
      tasksCompletedPerMonth: function () {
        this.statsType = 'allCompletedTasksPerMonth'
        this.tasksCompletedPer('YYYY-MM')
      },
      tasksCompletedPerWeek: function () {
        this.statsType = 'allCompletedTasksPerWeek'
        this.tasksCompletedPer('YYYY-MM-WW')
      },
      tasksCompletedPerMinute: function () {
        this.statsType = 'allCompletedTasksPerMinute'
        this.tasksCompletedPer('HH:mm')
      },
      tasksCompletedPerHour: function () {
        this.statsType = 'allCompletedTasksPerHour'
        this.tasksCompletedPer('HH')
      },
      tasksCompletedPerDayOfWeek: function () {
        this.statsType = 'allCompletedTasksPerDayOfWeek'
        this.tasksCompletedPer('E')
      }
    },
    computed: {
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
        grid-template-columns: 1fr 60px 70px 54px 60px;
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
        grid-template-areas: "statsOverview statsList";
        height: 89vh;
        min-height: 89vh;
    }

    .statsList {
        grid-area: statsList;
        display: grid;
        grid-template-rows: 100px 1fr;
        grid-template-areas: "statsHeader"
                             "canvasStats";
    }

    .statsHeader {
        grid-area: statsHeader;
    }

    .canvasStats {
        grid-area: canvasStats;
    }

    #logo {
        width: 80px;
        height: auto;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-top: 10px;
    }

    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
    }

    li {
        list-style: none;
    }

    .is-active {
        text-decoration: underline;
        cursor:pointer;
        color: forestgreen;
    }

    .statsChoice {
        text-decoration: underline;
        cursor:pointer;
    }


</style>
<template>
    <div id="mainPage">
        <div class="header">
            <img class="logo" id="logo" src="~@/assets/planntt.png" alt="planntt">
            <router-link class="home" to="/">Projects</router-link>
            <router-link class="journal" to="/journal">Journal</router-link>
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
                </ul>
                <ul>
                    <li :class="{'is-active': statsType === 'focusedTimePerDay'}" class="statsChoice" @click="focusedTimePerDay">focused time/day</li>
                    <li :class="{'is-active': statsType === 'focusedTimePerWeek'}" class="statsChoice" @click="focusedTimePerWeek">focused time/week</li>
                    <li :class="{'is-active': statsType === 'focusedTimePerMonth'}" class="statsChoice" @click="focusedTimePerMonth">focused time/month</li>
                </ul>
                <ul>
                    <li :class="{'is-active': statsType === 'allCreatedTasksPerDay'}" class="statsChoice" @click="tasksCreatedPerDay">created tasks/day</li>
                    <li :class="{'is-active': statsType === 'allCreatedTasksPerWeek'}" class="statsChoice" @click="tasksCreatedPerWeek">created tasks/week</li>
                    <li :class="{'is-active': statsType === 'allCreatedTasksPerMonth'}" class="statsChoice" @click="tasksCreatedPerMonth">created tasks/month</li>
                </ul>
                <ul>
                    <li :class="{'is-active': statsType === 'allDurationTasksPerDay'}" class="statsChoice" @click="tasksDurationPerDay">duration tasks/day</li>
                    <li :class="{'is-active': statsType === 'allDurationTasksPerWeek'}" class="statsChoice" @click="tasksDurationPerWeek">duration tasks/week</li>
                    <li :class="{'is-active': statsType === 'allDurationTasksPerMonth'}" class="statsChoice" @click="tasksDurationPerMonth">duration tasks/month</li>
                </ul>
                <ul>
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
        doneTasks: [],
        tasks: [],
        focusedTimeObjects: [],
        statsType: 'allCompletedTasksPerDay'
      }
    },
    created () {
      // Load the data (note we need the self, cause of the callback scope; we could try using an arrow function here)
      let self = this
      // Read the archived tasks:
      this.$archivedTaskDb.find({}, function (err, docs) {
        if (err) {
          console.log(err.stack)
          return
        }
        if (docs && docs.length > 0) {
          self.doneTasks = docs
          // Sort doneTasks by date (latest first):
          self.doneTasks.sort((a, b) => {
            return b.done - a.done
          })
          console.log('read archived task list from db for stats')
          // Always initialize tasks completed per day
          self.tasksCompletedPerDay()
        }
      })
      // Read the current tasks:
      this.$taskDb.find({}, function (err, docs) {
        if (err) {
          console.log(err.stack)
          return
        }
        if (docs && docs.length > 0) {
          self.tasks = docs
          // Sort tasks by created date (latest first):
          self.tasks.sort((a, b) => {
            return b.created - a.created
          })
          console.log('read task list from db for stats')
        }
      })
      // Read focused time:
      this.$focusedTime.find({}, function (err, docs) {
        if (err) {
          console.log(err.stack)
          return
        }
        if (!docs || docs.length === 0) {
          // There is nothing there yet.
        } else {
          self.focusedTimeObjects = docs
          console.log('read focusedTime from db for stats')
        }
      })
    },
    methods: {
      focusedTimePer: function (momentFormat) {
        // Clear canvas:
        document.getElementById('canvasStats').innerHTML = ''

        // Now group by format, for example, by day 'YYYY-MM-DD':
        // Count by day:
        let focusedTimeBy = []
        this.focusedTimeObjects.forEach(focusedTimeObject => {
          const date = focusedTimeObject['date']
          const timeInSeconds = focusedTimeObject['timeInSeconds']
          const transformedDate = this.$moment(date).format(momentFormat)
          focusedTimeBy.push({date: transformedDate, timeInSeconds: timeInSeconds})
        })

        const DataModel = muze.DataModel
        const schema = [
          {
            name: 'date', // Name of the variable
            type: 'dimension' // Date time is a dimension
          },
          {
            name: 'timeInSeconds',
            type: 'measure'
          }
        ]
        const dm = new DataModel(focusedTimeBy, schema)
        const groupBy = DataModel.Operators.groupBy

        let groupedFn = groupBy(['date'], {timeInSeconds: 'sum'})
        const outputDM = groupedFn(dm).sort([['date', 'ASC']])
        const env = muze()
        const canvas = env.canvas()
        const html = muze.Operators.html

        let rows = ['timeInSeconds']

        if (focusedTimeBy.length === 0) {
          document.getElementById('canvasStats').innerHTML = '<i>no time spent in focused mode</i>'
          return
        }

        canvas
          .data(outputDM)
          // .width(700)
          // .height(500)
          .rows(rows) /* Gets plotted on y-axis */
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
                tickFormat: val => {
                  let xValue = this.prettyTotalTimeSpent(val)
                  return xValue
                },
                showAxisName: false
              },
              x: {
                tickFormat: val => {
                  if (momentFormat === 'YYYY-WW') {
                    const weekNumber = val.substring(val.length - 2, val.length)
                    const year = val.substr(0, 4)
                    const mondayOfWeek = this.$moment().day('Monday').week(weekNumber).year(year)
                    return mondayOfWeek.format('YYYY-MM-DD')
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
                    let timeInSecondsPoint = this.prettyTotalTimeSpent(dataArray[fieldConfig.timeInSeconds.index])

                    if (momentFormat === 'YYYY-WW') {
                      const week = datePoint.substring(datePoint.length - 2, datePoint.length)
                      tooltipContent += `${timeInSecondsPoint} in week ${week}`
                    } else {
                      tooltipContent += `${timeInSecondsPoint} on ${datePoint}`
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
      tasksPer: function (momentFormat, dateSelector, taskList, durationDoneAndCreated) {
        // Clear canvas:
        document.getElementById('canvasStats').innerHTML = ''

        // Now group by format, for example, by day 'YYYY-MM-DD':
        // Count by day:
        let countTasksBy = []
        taskList.forEach(task => {
          if (dateSelector(task)) {
            const selectedDay = this.$moment(dateSelector(task)).format(momentFormat)
            let durationTaskMs = 0
            if (task.done && task.created) {
              durationTaskMs = this.$moment(task.done).diff(this.$moment(task.created))
            }
            countTasksBy.push({date: selectedDay, count: 1, duration: durationTaskMs})
          }
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
          },
          {
            name: 'duration',
            type: 'measure'
          }
        ]
        const dm = new DataModel(countTasksBy, schema)
        const groupBy = DataModel.Operators.groupBy

        let groupedFn
        if (durationDoneAndCreated) {
          groupedFn = groupBy(['date'], {duration: 'avg'})
        } else {
          groupedFn = groupBy(['date'], {count: 'count'})
        }
        const outputDM = groupedFn(dm).sort([['date', 'ASC']])
        const env = muze()
        const canvas = env.canvas()
        const html = muze.Operators.html

        let rows = ['count']
        if (durationDoneAndCreated) {
          rows = ['duration']
        }

        canvas
          .data(outputDM)
          // .width(700)
          // .height(500)
          .rows(rows) /* Gets plotted on y-axis */
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
                tickFormat: val => {
                  if (durationDoneAndCreated) {
                    return Math.floor(this.$moment.duration(val).asHours()) + ' hours'
                  }
                  return val
                },
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
                  if (momentFormat === 'YYYY-WW') {
                    const weekNumber = val.substring(val.length - 2, val.length)
                    const year = val.substr(0, 4)
                    const mondayOfWeek = this.$moment().day('Monday').week(weekNumber).year(year)
                    return mondayOfWeek.format('YYYY-MM-DD')
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
                    let durationPoint
                    let countPoint
                    if (durationDoneAndCreated) {
                      durationPoint = this.$moment.duration(dataArray[fieldConfig.duration.index]).humanize()
                    } else {
                      countPoint = dataArray[fieldConfig.count.index]
                    }

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
                    } else if (momentFormat === 'YYYY-WW') {
                      const weekNumber = datePoint.substring(datePoint.length - 2, datePoint.length)
                      const year = datePoint.substr(0, 4)
                      const mondayOfWeek = this.$moment().day('Monday').week(weekNumber).year(year)
                      const day = mondayOfWeek.format('YYYY-MM-DD')
                      if (durationDoneAndCreated) {
                        tooltipContent += `${durationPoint} in week of ${day}`
                      } else {
                        tooltipContent += `${countPoint} in week of ${day}`
                      }
                    } else {
                      if (durationDoneAndCreated) {
                        tooltipContent += `${durationPoint} on ${datePoint}`
                      } else {
                        tooltipContent += `${countPoint} on ${datePoint}`
                      }
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
      focusedTimePerDay: function () {
        this.statsType = 'focusedTimePerDay'
        this.focusedTimePer('YYYY-MM-DD')
      },
      focusedTimePerMonth: function () {
        this.statsType = 'focusedTimePerMonth'
        this.focusedTimePer('YYYY-MM')
      },
      focusedTimePerWeek: function () {
        this.statsType = 'focusedTimePerWeek'
        this.focusedTimePer('YYYY-WW')
      },
      tasksCompletedPerDay: function () {
        this.statsType = 'allCompletedTasksPerDay'
        this.tasksPer('YYYY-MM-DD', task => task.done, this.doneTasks)
      },
      tasksCompletedPerMonth: function () {
        this.statsType = 'allCompletedTasksPerMonth'
        this.tasksPer('YYYY-MM', task => task.done, this.doneTasks)
      },
      tasksCompletedPerWeek: function () {
        this.statsType = 'allCompletedTasksPerWeek'
        this.tasksPer('YYYY-WW', task => task.done, this.doneTasks)
      },
      tasksCreatedPerDay: function () {
        this.statsType = 'allCreatedTasksPerDay'
        this.tasksPer('YYYY-MM-DD', task => task.created, this.tasks.concat(this.doneTasks))
      },
      tasksCreatedPerMonth: function () {
        this.statsType = 'allCreatedTasksPerMonth'
        this.tasksPer('YYYY-MM', task => task.created, this.tasks.concat(this.doneTasks))
      },
      tasksCreatedPerWeek: function () {
        this.statsType = 'allCreatedTasksPerWeek'
        this.tasksPer('YYYY-WW', task => task.created, this.tasks.concat(this.doneTasks))
      },
      tasksDurationPerDay: function () {
        this.statsType = 'allDurationTasksPerDay'
        this.tasksPer('YYYY-MM-DD', task => task.done, this.doneTasks, true)
      },
      tasksDurationPerMonth: function () {
        this.statsType = 'allDurationTasksPerMonth'
        this.tasksPer('YYYY-MM', task => task.done, this.doneTasks, true)
      },
      tasksDurationPerWeek: function () {
        this.statsType = 'allDurationTasksPerWeek'
        this.tasksPer('YYYY-WW', task => task.done, this.doneTasks, true)
      },
      tasksCompletedPerMinute: function () {
        this.statsType = 'allCompletedTasksPerMinute'
        this.tasksPer('HH:mm', task => task.done, this.doneTasks)
      },
      tasksCompletedPerHour: function () {
        this.statsType = 'allCompletedTasksPerHour'
        this.tasksPer('HH', task => task.done, this.doneTasks)
      },
      tasksCompletedPerDayOfWeek: function () {
        this.statsType = 'allCompletedTasksPerDayOfWeek'
        this.tasksPer('E', task => task.done, this.doneTasks)
      },
      prettyTotalTimeSpent: function (timeInSeconds) {
        let totalTimeSpent = 0
        if (timeInSeconds) {
          totalTimeSpent = timeInSeconds
        }
        const hours = Math.floor(totalTimeSpent / 3600)
        const minutes = Math.floor((totalTimeSpent - (hours * 3600)) / 60)
        const seconds = totalTimeSpent - (hours * 3600) - (minutes * 60)
        return hours + 'h:' + minutes + 'm:' + seconds + 's'
      }
    },
    computed: {
    }
  }
</script>

<style scoped>

    #mainPage {
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-weight: 500;
        font-size: 10pt;
        -webkit-font-smoothing: antialiased;
    }

    .header {
        display: grid;
        grid-area: header;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr 70px 80px 64px 64px 70px;
        grid-template-areas: "logo home deadlines journal archive stats";
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

    .journal {
        grid-area: journal;
        text-decoration: underline;
        color: black;
    }

    .stats {
        grid-area: stats;
        text-decoration: underline;
        color:  forestgreen;
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
        margin-bottom: 1em;
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

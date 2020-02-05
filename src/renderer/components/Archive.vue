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
            <div class="archiveActions">
                <ul>
                    <li :class="{'is-active': true}" class="exportToCSV" @click="exportToCsv">export</li>
                </ul>
            </div>
            <ArchiveList/>
        </div>
    </div>
</template>

<script>
  import Planntt from '../App'
  import ArchiveList from './ArchiveList.vue'

  export default {
    name: 'Archive',
    components: {
      Planntt,
      ArchiveList
    },
    methods: {
      exportToCsv: function () {
        console.log('exporting to CSV')
        this.$archivedTaskDb.find({}, function (err, docs) {
          if (err) {
            console.log(err.stack)
            return
          }
          if (docs && docs.length > 0) {
            let tasks = docs
            // Sort tasks by date (latest first):
            tasks.sort((a, b) => {
              return b.done - a.done
            })
            console.log('read archived task list from db for exporting to db')
            let csv = 'created,done,name,projectName,note,when,numberOfSessions,totalTimeSpentInSeconds\n'
            tasks.forEach(task => {
              csv += task.created + ','
              csv += task.done + ','
              csv += '"' + task.name + '"' + ','
              csv += '"' + task.projectName + '"' + ','
              if (task.note) {
                csv += '"' + task.note + '"' + ','
              } else {
                csv += '"",'
              }
              csv += task.when + ','
              if (task.numberOfSessions) {
                csv += '"' + task.numberOfSessions + '"' + ','
              } else {
                csv += '"",'
              }
              if (task.totalTimeSpent) {
                csv += '"' + task.totalTimeSpent + '"' + ','
              } else {
                csv += '"",'
              }
              csv += '\n'
            })
            let hiddenElement = document.createElement('a')
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
            hiddenElement.target = '_blank'
            hiddenElement.download = 'archivedTasks.csv'
            hiddenElement.click()
          }
        })
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
        color: forestgreen;
    }

    .deadlines {
        grid-area: deadlines;
        text-decoration: underline;
        color: black;
    }

    .stats {
        grid-area: stats;
        text-decoration: underline;
        color: black;
    }

    .content {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 200px 1fr;
        grid-template-areas: "archiveActions   archiveList";
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

    .exportToCsv {
        text-decoration: underline;
        cursor:pointer;
    }

</style>

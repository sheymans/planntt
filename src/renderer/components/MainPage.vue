<template>
    <div id="mainPage">
        <div class="header">
            <img class="logo" id="logo" src="~@/assets/planntt.png" alt="planntt">
            <router-link class="home" to="/">Projects</router-link>
            <router-link class="deadlines" to="/deadlines">Deadlines</router-link>
            <router-link class="archive" to="/archive">Archive</router-link>
        </div>
        <div class="content">
            <div class="projectList">
                <ProjectList/>
            </div>
            <TaskList/>
        </div>
        <div class="footer">
            <div class="dataLocation">{{dataLocation}}</div>
        </div>
    </div>
</template>

<script>
  import ProjectList from './ProjectList.vue'
  import TaskList from './TaskList.vue'
  import Planntt from '../App'
  import { remote } from 'electron'

  export default {
    name: 'MainPage',
    components: {
      Planntt,
      ProjectList,
      TaskList
    },
    data () {
      return {
        dataLocation: {}
      }
    },
    created () {
      let self = this
      this.$preferences.find({}, function (err, docs) {
        if (err) {
          console.log(err.stack)
          return
        }
        if (!docs || docs.length === 0) {
          let dataLocation = remote.app.getPath('userData')
          console.log('no preferences existing, creating new preferences file with data location: ' + dataLocation)
          let preference = {'dataLocation': dataLocation}
          self.$preferences.insert(preference)
          self.dataLocation = dataLocation
        } else {
          let dataLocationObject = docs[0]
          self.dataLocation = dataLocationObject['dataLocation']
          console.log('data location read from preferences: ' + self.dataLocation)
        }
      })
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
        height: 98vh;
        min-height: 98vh;
    }

    .header {
        display: grid;
        grid-area: header;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr 60px 70px 60px;
        grid-template-areas: "logo home deadlines archive";
    }

    .logo {
        grid-area: logo
    }

    .home {
        grid-area: home;
        text-decoration: underline;
        color: forestgreen;
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

    .content {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 200px 1fr;
        grid-template-areas: "projectList   taskList";
        height: 89vh;
        min-height: 89vh;
    }

    .projectList {
        grid-area: projectList
    }

    .footer {
        display: grid;
        grid-area: footer;
        grid-template-rows: 1fr;
        grid-template-areas: "dataLocation";
    }

    .dataLocation {
        grid-area: dataLocation;
        justify-self: end;
        font-style: normal;
        font-weight: 300;
        font-size: 8pt;
    }

    #logo {
        width: 80px;
        height: auto;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-top: 10px;
    }

</style>
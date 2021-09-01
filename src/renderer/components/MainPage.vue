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
            <div class="projectList">
                <ProjectList/>
            </div>
            <TaskList/>
        </div>
        <div class="footer">
          <div class="coffee">
            <a target="_blank" href="https://www.buymeacoffee.com/stijnh">
              <img id="coffee-img" v-tipster="'like planntt? buy me a coffee'" class="coffee-image" data-tippy-size="jumbo" src="~@/assets/coffee.svg"/>
            </a>
          </div>
          <router-link v-tipster="'your data'" class="dataLocation" :to="{ name: 'preferences', params: { } }">{{preference.dataLocation}}</router-link>
        </div>
    </div>
</template>

<script>
import ProjectList from './ProjectList.vue'
import TaskList from './TaskList.vue'
import Planntt from '../App'
const app = require('@electron/remote').app

export default {
  name: 'MainPage',
  components: {
    Planntt,
    ProjectList,
    TaskList
  },
  data () {
    return {
      preference: { dataLocation: app.getPath('userData') }
    }
  },
  created () {
    const fs = require('fs')
    try {
      const contents = JSON.parse(fs.readFileSync(app.getPath('userData') + '/preferences.db').toString())
      if (contents) {
        this.preference = contents
        console.log('preference file exists and using it: ' + this.preference.dataLocation)
      }
    } catch (err) {
      console.log('no preferences.db exists. will create it now')
      const preference = { dataLocation: app.getPath('userData') }
      fs.writeFileSync(app.getPath('userData') + '/preferences.db', JSON.stringify(preference))
    }
  },
  methods: {}
}
</script>

<style scoped>

    #mainPage {
        font-family: 'JetBrains Mono';
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
        grid-template-columns: 1fr 70px 80px 64px 64px 70px;
        grid-template-areas: "logo home deadlines journal archive stats";
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

    .journal {
        grid-area: journal;
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
        grid-template-columns: 340px 1fr;
        grid-template-areas: "projectList   taskList";
        height: 89vh;
        min-height: 89vh;
    }

    .projectList {
        grid-area: projectList;
        height: 89vh;
    }

    .footer {
        display: grid;
        grid-area: footer;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: "coffee dataLocation";
    }

    .dataLocation {
        grid-area: dataLocation;
        justify-self: end;
        font-style: normal;
        font-weight: 300;
        font-size: 8pt;
        text-decoration: underline;
        cursor:pointer;
        margin-right: 5px;
        color: black;
    }

    .coffee {
      grid-area: coffee;
      justify-self: start;
      cursor:pointer;
    }

    .coffee-image {
      height: 15px;
    }

    .dataLocationChangeDialog {
        display: grid;
        grid-area: dataLocationChangeDialog;
        grid-template-rows: 30px 30px 40px 40px 1fr;
        grid-template-areas: "dataLocationTitle"
        "dataLocationCurrent"
        "dataLocationExplanation"
        "dataLocationNew"
        "dataLocationActions";
        margin: 20px;
        height: 250px;
    }

    .dataLocationTitle {
        grid-area: dataLocationTitle;
        font-style: normal;
        font-weight: 700;
        font-size: 12pt;

    }

    .dataLocationCurrent {
        grid-area: dataLocationCurrent;
    }

    .dataLocationExplanation {
        grid-area: dataLocationExplanation;
    }

    .dataLocationNew {
        grid-area: dataLocationNew;
    }

    .dataLocationActions {
        grid-area: dataLocationActions;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-self: end;
        grid-column-gap: 20px;
        align-self: end;
    }

    .directoryAction {
        text-decoration: underline;
        cursor: pointer;
        color: forestgreen;
    }

    .cancelAction {
        color: black;
    }

    #logo {
        width: 80px;
        height: auto;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-top: 10px;
    }

</style>

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
            <modal name="dataLocationModal">
                <div class="dataLocationChangeDialog">
                    <h2>Change your Data Location</h2>
                    <p>Currently, your data is stored at {{preference.dataLocation}}.
                        You can copy <tt>projects.db</tt>, <tt>tasks.db</tt>, and <tt>archivedTasks.db</tt> to any folder of your choice and tell <tt>planntt</tt> to use that folder to read and write data from.</p>
                    <p><a class="directoryAction" @click="selectDirectory">Change</a> or <a class="directoryAction" @click="resetDirectory">reset to the original</a></p>
                    <p v-if="newDataLocation">We will start reading and write data from <b>{{newDataLocation}}</b></p>
                    <p v-if="newDataLocation"><a class="directoryAction" @click="confirmLocationChange">OK, let's do it</a> or <a class="directoryAction" @click="abortLocationChange">NO, get me out of here</a>.</p>
                </div>
            </modal>
            <div class="dataLocation" href="#" @click="openDataLocationChange">{{preference.dataLocation}}</div>
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
        preference: {'dataLocation': remote.app.getPath('userData')},
        newDataLocation: null
      }
    },
    created () {
      const fs = require('fs')
      try {
        const contents = JSON.parse(fs.readFileSync(remote.app.getPath('userData') + '/preferences.db').toString())
        if (contents) {
          this.preference = contents
          console.log('preference file exists and using it: ' + this.preference['dataLocation'])
        }
      } catch (err) {
        console.log('no preferences.db exists. will create it now')
        let preference = {'dataLocation': remote.app.getPath('userData')}
        fs.writeFileSync(remote.app.getPath('userData') + '/preferences.db', JSON.stringify(preference))
      }
    },
    methods: {
      openDataLocationChange: function () {
        this.$modal.show('dataLocationModal')
      },
      selectDirectory: function () {
        let self = this
        const { dialog } = require('electron').remote
        dialog.showOpenDialog({
          properties: ['openDirectory', 'createDirectory']
        }, function (selectedDirectories) {
          if (selectedDirectories && selectedDirectories.length > 0) {
            self.newDataLocation = selectedDirectories[0]
          }
        })
      },
      resetDirectory: function () {
        let userDir = remote.app.getPath('userData')
        this.newDataLocation = userDir
      },
      confirmLocationChange: function () {
        if (this.newDataLocation) {
          let preference = {'dataLocation': this.newDataLocation}
          console.log('writing new preferences to file')
          const fs = require('fs')
          fs.writeFileSync(remote.app.getPath('userData') + '/preferences.db', JSON.stringify(preference))
          console.log('done writing new preferences to file')
          this.preference = preference
          this.newDataLocation = null
          this.$modal.hide('dataLocationModal')
          console.log('user has changed data location to ' + this.preference['dataLocation'])
          console.log('reloading the app now')
          const {getCurrentWindow} = require('electron').remote
          getCurrentWindow().reload()
        }
      },
      abortLocationChange: function () {
        this.newDataLocation = null
        this.$modal.hide('dataLocationModal')
        console.log('user aborted data location change')
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
        text-decoration: underline;
        cursor:pointer;
    }

    .directoryAction {
        text-decoration: underline;
        cursor: pointer
    }

    #logo {
        width: 80px;
        height: auto;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-top: 10px;
    }

</style>
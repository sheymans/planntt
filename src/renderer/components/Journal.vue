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
            <div class="journalOverview">
                <ul>
                    <li :class="{'is-active': journalType === 'all'}" class="journalChoice" @click="all">all</li>
                    <li :class="{'is-active': journalType === 'today'}" class="journalChoice" @click="today">today</li>
                    <li :class="{'is-active': journalType === 'yesterday'}" class="journalChoice" @click="yesterday">yesterday</li>
                </ul>
            </div>
            <journalEntryList :journalType="journalType"/>
        </div>
        <div class="footer">
            <modal name="dataLocationModal">
                <div class="dataLocationChangeDialog">
                    <div class="dataLocationTitle">Change your Data Location</div>
                    <div class="dataLocationCurrent">Currently, your data is stored at <i>{{preference.dataLocation}}</i></div>
                    <div class="dataLocationExplanation">You can copy <tt>projects.db</tt>, <tt>tasks.db</tt>, and <tt>archivedTasks.db</tt> to any folder of your choice and tell <tt>planntt</tt> to use that folder to read and write data from.</div>
                    <div class="dataLocationNew" v-if="newDataLocation">We will start reading and write data from <b>{{newDataLocation}}</b></div>
                    <div class="dataLocationActions">
                        <div v-show="!newDataLocation" class="directoryAction" @click="selectDirectory">change</div>
                        <div v-show="!newDataLocation" class="directoryAction" @click="resetDirectory">reset</div>
                        <div v-show="newDataLocation" class="directoryAction" @click="confirmLocationChange">confirm</div>
                        <div class="directoryAction cancelAction" @click="abortLocationChange">cancel</div>
                    </div>
                </div>
            </modal>
            <div class="dataLocation" href="#" @click="openDataLocationChange">{{preference.dataLocation}}</div>
        </div>
    </div>
</template>

<script>
  import JournalEntryList from './JournalEntryList.vue'
  import Planntt from '../App'
  import { remote } from 'electron'

  export default {
    name: 'Journal',
    components: {
      Planntt,
      JournalEntryList
    },
    data () {
      return {
        preference: {'dataLocation': remote.app.getPath('userData')},
        newDataLocation: null,
        journalType: 'all'
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
      all: function () {
        this.journalType = 'all'
      },
      today: function () {
        this.journalType = 'today'
      },
      yesterday: function () {
        this.journalType = 'yesterday'
      },
      openDataLocationChange: function () {
        this.$modal.show('dataLocationModal')
      },
      selectDirectory: function () {
        let self = this
        const { dialog } = require('electron').remote
        dialog.showOpenDialog({
          properties: ['openDirectory', 'createDirectory']
        }).then((data) => {
          let selectedDirectories = data.filePaths
          console.log(data.filePaths)
          if (selectedDirectories && selectedDirectories.length > 0) {
            console.log('we selected a directory ' + selectedDirectories[0])
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
        grid-template-columns: 1fr 60px 70px 54px 54px 60px;
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

    .journal {
        grid-area: journal;
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

    .stats {
        grid-area: stats;
        text-decoration: underline;
        color: black;
    }

    .content {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 200px 1fr;
        grid-template-areas: "journalOverview journalEntryList";
        height: 89vh;
        min-height: 89vh;
    }

    .journalStructure {
        grid-area: journalStructure;
        height: 89vh;
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
        margin-right: 5px;
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

    .journalChoice {
        text-decoration: underline;
        cursor:pointer;
    }

</style>

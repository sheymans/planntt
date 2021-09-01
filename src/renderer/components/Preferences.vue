<template>
    <div id="mainPage">
        <div class="header">
            <div></div>
            <font-awesome-icon v-tipster="'leave focus mode (ESC)'" icon="times" @click="goBack"/>
        </div>
        <div class="content">
          <div name="dataLocationModal">
            <div class="dataLocationChangeDialog">
              <div class="dataLocationTitle">Change your Data Location</div>
              <div class="dataLocationCurrent">Currently, your data is stored at <i>{{preference.dataLocation}}</i></div>
              <div class="dataLocationExplanation">You can copy all <tt>.db</tt> files in that folder to any other folder and tell <tt>planntt</tt> to use that folder to read and write data from.</div>
              <div class="dataLocationNew" v-if="newDataLocation">We will use <b>{{newDataLocation}}</b> as the new data store.</div>
              <div class="dataLocationActions">
                <div v-show="!newDataLocation" class="directoryAction" @click="selectDirectory">change</div>
                <div v-show="!newDataLocation" class="directoryAction" @click="resetDirectory">reset</div>
                <div v-show="newDataLocation" class="directoryAction" @click="confirmLocationChange">confirm</div>
                <div class="directoryAction cancelAction" @click="abortLocationChange">cancel</div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import Planntt from '../App'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { app } from '@electron/remote'

export default {
  name: 'Preferences',
  components: {
    FontAwesomeIcon, Planntt
  },
  props: {
  },
  data () {
    return {
      preference: { dataLocation: app.getPath('userData') },
      newDataLocation: null
    }
  },
  mounted () {

  },
  created () {
    document.addEventListener('keydown', this.escapeHandler)
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
  destroyed () {
    clearInterval(this.interval)
    document.removeEventListener('keydown', this.escapeHandler)
  },
  methods: {
    goBack: function () {
      this.$router.push('/')
    },
    escapeHandler: function (event) {
      event.stopImmediatePropagation()
      console.log('executing event listener')
      if (event.key === 'Escape' || event.keyCode === 27) {
        this.goBack()
      }
    },
    selectDirectory: function () {
      const self = this
      const { dialog } = require('@electron/remote')
      dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory']
      }).then((data) => {
        const selectedDirectories = data.filePaths
        console.log(data.filePaths)
        if (selectedDirectories && selectedDirectories.length > 0) {
          console.log('we selected a directory ' + selectedDirectories[0])
          self.newDataLocation = selectedDirectories[0]
        }
      })
    },
    resetDirectory: function () {
      const userDir = app.getPath('userData')
      this.newDataLocation = userDir
    },
    confirmLocationChange: function () {
      if (this.newDataLocation) {
        const preference = { dataLocation: this.newDataLocation }
        console.log('writing new preferences to file')
        const fs = require('fs')
        fs.writeFileSync(app.getPath('userData') + '/preferences.db', JSON.stringify(preference))
        console.log('done writing new preferences to file')
        this.preference = preference
        this.newDataLocation = null
        console.log('user has changed data location to ' + this.preference.dataLocation)
        this.goBack()
        console.log('reloading the app now')
        const { getCurrentWindow } = require('@electron/remote')
        getCurrentWindow().reload()
      }
    },
    abortLocationChange: function () {
      this.newDataLocation = null
      console.log('user aborted data location change')
      this.goBack()
    }
  },
  computed: {}
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
        grid-template-columns: 1fr 10px;
        grid-template-areas: ". close";
        margin-right: 10px;
        margin-top: 10px;
    }

    .close {
        display: grid;
        color: gray;
    }

    .content {
        display: grid;
        grid-area: content;
        grid-template-rows: 100px 1fr 1fr;
        grid-template-columns: 1fr;
        grid-template-areas: "timers"
        "name"
        "note";
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

</style>

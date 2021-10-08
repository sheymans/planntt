<template>
    <div class="journalEntryList">
        <div :class="{'journalEntries': isJournalEntrySelected, 'journalEntriesLarge': !isJournalEntrySelected}">
            <div class="journalEntryHeader">
                    <b>JOURNAL ({{numberOfJournalEntries}})</b>
            </div>
            <input class="journalEntryInput"
                   autofocus autocomplete="off"
                   placeholder="Filter journal/press enter to add a new journal entry"
                   v-model="newJournalEntryText"
                   @keyup.enter="addJournalEntry">

            <div class="removeJournalEntriesLine">
                <button v-show="numberOfEntriesSelected > 0" class="removeJournalEntries" @click="removeCompleted">
                    <font-awesome-icon icon="trash-alt"/> remove selected
                </button>
            </div>

            <div class="theSelectableJournalEntryList">
                <div :class="{'journalEntryDivisions': isJournalEntrySelected, 'journalEntryDivisionsLarge': !isJournalEntrySelected}">
                        <JournalEntry v-for="journalEntry in viewableJournalEntries"
                              :key="journalEntry.id"
                              @setSelectedJournalEntry="setSelectedJournalEntry"
                              @unsetSelectedJournalEntry="unsetSelectedJournalEntry"
                              :journalEntry="journalEntry"/>
                </div>
                <JournalEntryDetail :journalEntry="selectedJournalEntry" @closeDetail="closeDetail"/>
            </div>
        </div>
    </div>
</template>

<script>
import JournalEntry from './JournalEntry.vue'
import JournalEntryDetail from './JournalEntryDetail.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'JournalEntryList',
  components: {
    JournalEntryDetail,
    JournalEntry,
    FontAwesomeIcon
  },
  props: {
    journalType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      newJournalEntryText: '',
      journalEntries: [],
      selectedJournalEntry: {}
    }
  },
  computed: {
    editingJournalNote: function () {
      return this.$store.getters.isEditingJournalNote
    },
    isJournalEntrySelected: function () {
      return Object.keys(this.selectedJournalEntry).length !== 0
    },
    viewableJournalEntries: function () {
      // Make a copy cause this.journalEntries does not seem to change when sorting.
      let entries = this.journalEntries

      // Sort with newest created on top
      entries.sort((a, b) => {
        const bDate = this.$moment(b.journalDate).format('YYYY-MM-DD')
        const aDate = this.$moment(a.journalDate).format('YYYY-MM-DD')
        if (bDate < aDate) {
          return -1
        }
        if (bDate === aDate) {
          return b.created - a.created
        }
        return 1
      })

      let matching = j => true
      if (this.journalType === 'today') {
        matching = this.matchToday
      }
      if (this.journalType === 'yesterday') {
        matching = this.matchYesterday
      }

      entries = entries.filter(j => matching(j) && this.searchFilter(j, this.newJournalEntryText))
      return entries
    },
    numberOfEntriesSelected: function () {
      if (this.viewableJournalEntries) {
        const checkedJournalEntries = this.viewableJournalEntries.filter(t => t.checked)
        return checkedJournalEntries.length
      } else {
        return 0
      }
    },
    numberOfJournalEntries: function () {
      if (this.viewableJournalEntries) {
        return this.viewableJournalEntries.length
      } else {
        return 0
      }
    }
  },
  created () {
    document.addEventListener('keydown', this.keyHandler)
    // Load the data (note we need the self, cause of the callback scope; we could try using an arrow function here)
    const self = this
    this.$journal.find({}, function (err, docs) {
      if (err) {
        console.log(err.stack)
        return
      }
      if (docs && docs.length > 0) {
        self.journalEntries = docs
        console.log('read existing journal entry list from db')
      }
    })
  },
  destroyed () {
    document.removeEventListener('keydown', this.keyHandler)
  },
  filters: {
  },
  methods: {
    matchToday: function (journalEntry) {
      const today = this.$moment().format('MM-DD')
      const journalD = this.$moment(journalEntry.journalDate).format('MM-DD')
      return today === journalD
    },
    matchYesterday: function (journalEntry) {
      const yesterday = this.$moment().add(-1, 'days').format('MM-DD')
      const journalD = this.$moment(journalEntry.journalDate).format('MM-DD')
      return yesterday === journalD
    },
    keyHandler: function (event) {
      event.stopImmediatePropagation()
      if (event.key === 'Escape' || event.keyCode === 27) {
        this.unsetSelectedJournalEntry()
      }
      if (event.keyCode === 38 && !event.metaKey && !this.editingJournalNote) { // up arrow for selecting previous journal entry
        console.log('up arrow pressed for select previous journal entry')
        if (this.selectedJournalEntry.name) {
          const t = this.selectedJournalEntry
          this.selectPreviousJournalEntry(t)
        } else {
          // if there is no journal entry selected, select the last journal entry in list on an up-arrow
          const t = this.findLastVisible()
          this.setSelectedJournalEntry(t)
        }
      }
      if (event.keyCode === 40 && !event.metaKey && !this.editingJournalNote) { // down for selecting next journal entry
        console.log('down arrow pressed for select next journal entry')
        if (this.selectedJournalEntry.name) {
          const t = this.selectedJournalEntry
          this.selectNextJournalEntry(t)
        } else {
          // if there is no journal entry selected, select the first journal entry in list on an down-arrow
          const t = this.findFirstVisible()
          this.setSelectedJournalEntry(t)
        }
      }
      if (event.keyCode === 69 && event.metaKey) { // meta+d for copy filtered entries to clipboard
        console.log('key e pressed for copy to clipboard')
        this.exportToMarkdown()
      }
      if (event.keyCode === 70 && event.metaKey) { // meta+f for focus
        console.log('key f pressed for focus mode')
        if (this.selectedJournalEntry.name) {
          const j = this.selectedJournalEntry
          this.$router.push({ name: 'focusJournalEntry', params: { journalEntry: j } })
        }
      }
    },
    selectPreviousJournalEntry: function (entry) {
      const previousJournalEntry = this.findPreviousVisible(entry)
      if (!previousJournalEntry) {
        return
      }
      this.setSelectedJournalEntry(previousJournalEntry)
    },
    selectNextJournalEntry: function (entry) {
      const nextJournalEntry = this.findNextVisible(entry)
      if (!nextJournalEntry) {
        return
      }
      this.setSelectedJournalEntry(nextJournalEntry)
    },
    findPreviousVisible: function (entry) {
      let previousJournalEntry
      const thisEntryIndex = this.viewableJournalEntries.findIndex(e => e === entry)
      if (thisEntryIndex > 0) {
        previousJournalEntry = this.viewableJournalEntries[thisEntryIndex - 1]
      }
      return previousJournalEntry
    },
    findNextVisible: function (entry) {
      let nextJournalEntry
      const thisEntryIndex = this.viewableJournalEntries.findIndex(e => e === entry)
      if (thisEntryIndex < this.viewableJournalEntries.length - 1) {
        nextJournalEntry = this.viewableJournalEntries[thisEntryIndex + 1]
      }
      return nextJournalEntry
    },
    findFirstVisible: function () {
      if (this.viewableJournalEntries.length > 0) {
        return this.viewableJournalEntries[0]
      }
    },
    findLastVisible: function () {
      if (this.viewableJournalEntries.length > 0) {
        return this.viewableJournalEntries[this.viewableJournalEntries.length - 1]
      }
    },
    searchFilter: function (journalEntry, textToSearch) {
      if (!textToSearch) {
        return true
      }
      const lSearch = textToSearch.toLowerCase()
      const mandatoryFieldsContains = journalEntry.name.toLowerCase().includes(lSearch)
      if (mandatoryFieldsContains) {
        return mandatoryFieldsContains
      }
      if (journalEntry.note) {
        const optionalFieldsContains = journalEntry.note.toLowerCase().includes(lSearch)
        if (optionalFieldsContains) {
          return optionalFieldsContains
        }
      }
      const journalDay = this.$moment(journalEntry.journalDate).format('YYYY-MM-DD')
      return journalDay.includes(lSearch)
    },
    unsetSelectedJournalEntry: function () {
      this.selectedJournalEntry = {}
      this.$store.commit('unsetSelectedJournalEntryId')
    },
    addJournalEntry: function () {
      const journalEntryName = this.newJournalEntryText && this.newJournalEntryText.trim()
      if (!journalEntryName) {
        return
      }
      const newJournalEntry = { id: uuidv4(), name: journalEntryName, created: new Date(), journalDate: new Date() }
      this.journalEntries.push(newJournalEntry)
      this.newJournalEntryText = ''
      // Add it to the DB as well
      this.$journal.insert(newJournalEntry)
      this.setSelectedJournalEntry(newJournalEntry)
    },
    removeCompleted: function () {
      const newJournalEntries = []
      this.journalEntries.forEach(journalEntry => {
        const keepJournalEntry = !journalEntry.checked
        if (keepJournalEntry) {
          newJournalEntries.push(journalEntry)
        } else {
          // Remove the task from the db
          this.$journal.remove({ id: journalEntry.id })
        }
      })
      this.journalEntries = newJournalEntries
    },
    setSelectedJournalEntry: function (journalEntry) {
      this.$store.commit('setSelectedJournalEntryId', journalEntry.id)
      this.selectedJournalEntry = journalEntry
    },
    closeDetail: function (task) {
      this.unsetSelectedJournalEntry()
    },
    exportToMarkdown: function () {
      console.log('copying selected journal entries to Markdown on clipboard')
      let markdown = ''
      const title = this.newJournalEntryText + '\n\n'
      markdown += title

      this.viewableJournalEntries.forEach(journalEntry => {
        markdown += '# ' + journalEntry.name + '\n\n'
        if (journalEntry.note) {
          markdown += journalEntry.note + '\n\n'
        }
        markdown += '(_' + this.$moment(journalEntry.journalDate).format('YYYY-MM-DD') + '_)\n\n'
      })
      const { clipboard } = require('electron')
      clipboard.writeText(markdown)
      console.log('done copying to clipboard')
    }
  }
}
</script>

<style scoped>

    .journalEntryList {
        grid-area: journalEntryList;
        display: flex;
        flex: 1 0 auto;
        height: 89vh;
    }

    /** 2 children of .journalEntryList **/
    .journalEntries {
        grid-area: journalEntries;
        display: grid;
        grid-template-rows: 20px 20px 20px 1fr;
        grid-template-columns: 1fr;
        grid-template-areas: "journalEntryHeader"
                             "journalEntryInput"
                             "removeJournalEntriesLine"
    "theSelectableJournalEntryList";
        grid-row-gap: 10px;
        width: 100%;
    }

    .journalEntriesLarge {
        display: grid;
        grid-template-rows: 20px 20px 20px 1fr;
        grid-template-columns: 1fr;
        grid-template-areas: "journalEntryHeader"
        "journalEntryInput"
        "removeJournalEntriesLine"
        "theSelectableJournalEntryList";
        grid-row-gap: 10px;
        width: 100%;
    }

    .journalEntryHeader {
        grid-area: journalEntryHeader;
    }

    .journalEntryInput {
      grid-area: journalEntryInput;
        width: 500px;
    }

    .theSelectableJournalEntryList {
        grid-area: theSelectableJournalEntryList;
        display: flex;
        flex-direction: row;
        flex: 1 0 auto;
        height: 78vh;
    }

    .journalEntryDivisions {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-shrink: 0;
        height: 78vh;
        width: 25vw;
    }

    .journalEntryDivisionsLarge {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-shrink: 0;
        width: 100%;
        height: 78vh;
    }

    .removeJournalEntriesLine {
        grid-area: removeJournalEntriesLine;
        grid-area: removeJournalEntriesLine;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 250px 1fr;
        grid-template-areas: "removeJournalEntries ."
    }

    .removeJournalEntries {
        grid-area: removeJournalEntries;
        justify-self: start;
    }

    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
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

    button {
        background-color: forestgreen;
        outline: 0;
        border: none;
        color: white;
        font-family: 'Roboto Mono';
        font-style: normal;
        font-weight: 500;
        width: 150px;
        height: 25px;
        line-height: 25px;
        text-transform: uppercase;
        border-radius: 2px;
        text-align: center;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: .3s ease-out;
        font-size: 12px;
    }

    button.removeJournalEntries {
        background-color: darkslategrey;
        outline: 0;
        border: none;
        color: white;
        font-family: 'Roboto Mono';
        font-style: normal;
        font-weight: 500;
        width: 150px;
        height: 25px;
        line-height: 25px;
        text-transform: uppercase;
        border-radius: 2px;
        text-align: center;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: .3s ease-out;
        font-size: 12px;
    }

</style>

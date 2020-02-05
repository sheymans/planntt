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
                    <div class="journalEntriesInTab" v-if="projectTasks['today'].length && todayStatus">
                        <JournalEntry v-for="journalEntry in viewableJournalEntries"
                              :key="journalEntry.id"
                              @setSelectedProjectEntry="setSelectedProjectEntry"
                              @unsetSelectedProjectEntry="unsetSelectedProjectEntry"
                              :journalEntry="journalEntry"/>
                    </div>
                </div>
            </div>

            <JournalEntryDetail :task="selectedProjectEntry" @closeDetail="closeDetail"/>
        </div>
    </div>
</template>

<script>
  import JournalEntry from './JournalEntry.vue'
  import JournalEntryDetail from './JournalEntryDetail.vue'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

  export default {
    name: 'JournalEntryList',
    components: {
      JournalEntryDetail,
      JournalEntry,
      FontAwesomeIcon
    },
    data () {
      return {
        newJournalEntryText: '',
        journalEntries: [],
        selectedJournalEntry: {}
      }
    },
    computed: {
      isJournalEntrySelected: function () {
        return Object.keys(this.selectedJournalEntry).length !== 0
      },
      viewableJournalEntries: function () {
        // Make a copy cause this.journalEntries does not seem to change when sorting.
        let entries = this.journalEntries

        // Sort with newest created on top
        entries.sort((a, b) => {
          if (a.journalDate && b.journalDate) {
            return this.$moment(b.journalDate).format('YYYY-MM-DD') - this.$moment(a.journalDate).format('YYYY-MM-DD')
          }
          if (a.created && b.created) {
            return b.created - a.created
          }
          if (a.created) {
            return 1
          }
          return 1
        })
        return entries
      },
      numberOfEntriesSelected: function () {
        if (this.viewableJournalEntries) {
          let checkedJournalEntries = this.viewableJournalEntries.filter(t => t.checked)
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
      // Load the data (note we need the self, cause of the callback scope; we could try using an arrow function here)
      let self = this
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
    },
    filters: {
    },
    methods: {
      searchFilter: function (journalEntry, textToSearch) {
        if (!textToSearch) {
          return true
        }
        let lSearch = textToSearch.toLowerCase()
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
        let journalDay = this.$moment(journalEntry.journalDate).format('YYYY-MM-DD')
        return journalDay.includes(lSearch)
      },
      unsetSelectedJournalEntry: function () {
        this.selectedJournalEntry = {}
        this.$store.commit('unsetSelectedJournalEntryId')
      },
      addJournalEntry: function () {
        let journalEntryName = this.newJournalEntryText && this.newJournalEntryText.trim()
        if (!journalEntryName) {
          return
        }
        let newJournalEntry = {id: this.uuidv4(), name: journalEntryName, created: new Date()}
        this.journalEntries.push(newJournalEntry)
        this.newJournalEntryText = ''
        // Add it to the DB as well
        this.$journal.insert(newJournalEntry)
        this.setSelectedJournalEntry(newJournalEntry)
      },
      removeCompleted: function () {
        let newJournalEntries = []
        this.journalEntries.forEach(journalEntry => {
          let keepJournalEntry = !journalEntry.checked
          if (keepJournalEntry) {
            newJournalEntries.push(journalEntry)
          } else {
            // Remove the task from the db
            this.$journal.remove({id: journalEntry.id})
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
      // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
      uuidv4: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          let r = Math.random() * 16 | 0
          let v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }
    }
  }
</script>

<style scoped>

    .journalEntryList {
        grid-area: taskList;
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
        flex-direction: column;
        flex: 1 0 auto;
        height: 78vh;
    }

    .journalEntryDivisions {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-shrink: 0;
        height: 40vh;
    }

    .journalEntryDivisionsLarge {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-shrink: 0;
        width: 100%;
        height: 78vh;
    }

    .journalEntriesInTab {
        grid-area: journalEntriesInTab;
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
        justify-self: end;
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

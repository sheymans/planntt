import Vue from 'vue'

<template>
    <div class="journalEntryItem">
        <div class="journalEntryCheckbox">
            <input type="checkbox" v-model="journalEntry.checked" @change="toggleJournalEntryCheckbox">
        </div>
        <div class="journalEntryLabel">{{ prettyMoment(journalEntry.journalDate) }}</div>
        <div :class="{selected: isSelectedJournalEntry}" @click="selectJournalEntry" class="journalEntrySummary">
            {{ journalEntry.name }}</div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'JournalEntry',
  components: { FontAwesomeIcon },
  props: {
    journalEntry: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      editing: false
    }
  },
  computed: {
    isSelectedJournalEntry: function () {
      const selectedJournalEntryId = this.$store.getters.getSelectedJournalEntryId
      return selectedJournalEntryId === this.journalEntry.id
    }
  },
  created () {
    // Set the selected journal entry based on the stored journal entry.
    const selectedJournalEntryId = this.$store.getters.getSelectedJournalEntryId
    if (selectedJournalEntryId === this.journalEntry.id) {
      this.$emit('setSelectedJournalEntry', this.journalEntry)
    }
  },
  filters: {
  },
  methods: {
    prettyMoment: function (t) {
      return this.$moment(t).format('YYYY-MM-DD')
    },
    toggleJournalEntryCheckbox: function () {
      this.$journal.update({ id: this.journalEntry.id }, { $set: { checked: this.journalEntry.checked } }, {})
      this.unSelectedJournalEntry()
    },
    selectJournalEntry: function () {
      this.$emit('setSelectedJournalEntry', this.journalEntry)
      this.$store.commit('setSelectedJournalEntryId', this.journalEntry.id)
    },
    unSelectedJournalEntry: function () {
      this.$emit('unsetSelectedJournalEntry')
    }
  }
}
</script>

<style scoped>

    .journalEntryItem {
        grid-area: journalEntryItem;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 20px 100px 0.9fr;
        grid-template-areas: "journalEntryCheckbox  journalEntryLabel    journalEntrySummary";
        align-items: baseline;
    }

    .journalEntryCheckbox {
        grid-area: journalEntryCheckbox;
    }

    .journalEntrySummary:hover {
        background-color: #4AD94A;
    }
    .journalEntrySummary {
        grid-area: journalEntrySummary;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .selected {
        text-decoration: underline;
        color: forestgreen;
    }

    .journalEntryLabel {
        grid-area: journalEntryLabel;
        color: darkslategrey;
        font-family: 'Roboto Mono';
        font-style: normal;
        font-size: 8px;
        -webkit-font-smoothing: antialiased;
    }
</style>

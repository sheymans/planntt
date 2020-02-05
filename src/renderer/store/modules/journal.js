import Vue from 'vue'

const maxCalendarDays = function () {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
}

const daysThirty = function () {
  return maxCalendarDays().slice(0, 30)
}

const daysTwentyNine = function () {
  return maxCalendarDays().slice(0, 29)
}

const state = {
  journalStructure: [
    {'month': 'January', 'days': maxCalendarDays()},
    {'month': 'February', 'days': daysTwentyNine()},
    {'month': 'March', 'days': maxCalendarDays()},
    {'month': 'April', 'days': daysThirty()s()},
    {'month': 'May', 'days': maxCalendarDays()},
    {'month': 'June', 'days': daysThirty()},
    {'month': 'July', 'days': maxCalendarDays()},
    {'month': 'August', 'days': maxCalendarDays()},
    {'month': 'September', 'days': daysThirty()},
    {'month': 'October', 'days': maxCalendarDays()},
    {'month': 'November', 'days': daysThirty()},
    {'month': 'December', 'days': maxCalendarDays()}],
  selectedJournalEntryId: null,
  editingJournalNote: false
}

const getters = {
  getJournalStructure (state) {
    return state.journalStructure
  },
  getSelectedJournalEntryId (state) {
    return state.selectedJournalEntryId
  },
  isEditingJournalNote (state) {
    return state.editingNote
  },
}

const mutations = {
  setSelectedJournalEntryId (state, id) {
    state.selectedJournalEntryId = id
  },
  unsetSelectedJournalEntryId (state) {
    state.selectedJournalEntryId = null
  },
  setEditingJournalNote (state, stateChange) {
    state.editingJournalNote = stateChange
  },
}

export default {
  state,
  mutations,
  getters
}

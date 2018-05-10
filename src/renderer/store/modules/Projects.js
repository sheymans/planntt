const state = {
  // INBOX is by default selected
  selected: 1
}

const getters = {
  getSelectedProject (state) {
    return state.selected
  }
}

const mutations = {
  setSelectedProject (state, uuid) {
    state.selected = uuid
  }
}

export default {
  state,
  mutations,
  getters
}

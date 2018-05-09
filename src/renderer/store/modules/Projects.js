const state = {
  selected: 'some node is selected by default'
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

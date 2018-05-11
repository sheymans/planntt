const state = {
  // We're not storing the actual task cause you can't mutate the state (which we would be doing as we would be storing a reference)
  selectedTask: {}
}

const getters = {
  getSelectedTask (state) {
    return state.selectedTask
  }
}

const mutations = {
  setSelectedTask (state, task) {
    let copiedTask = Object.assign({}, task)
    state.selectedTask = copiedTask
  }
}

export default {
  state,
  mutations,
  getters
}

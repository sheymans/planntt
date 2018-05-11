const state = {
  // INBOX is by default selected
  selected: 1,
  selectedProjectName: 'INBOX',
  subProjects: {},
  deletedProjects: []
}

const getters = {
  getSelectedProject (state) {
    return state.selected
  },
  getSelectedProjectName (state) {
    return state.selectedProjectName
  },
  getStoredDescendantProjectIdsOfSelected (state) {
    if (!state.selected) {
      return []
    }
    let descendantsIncludingSelected = [state.selected]
    let storedIds = state.subProjects[state.selected]
    if (storedIds) {
      descendantsIncludingSelected.push(...storedIds)
    }
    return descendantsIncludingSelected
  },
  getDeletedProjects (state) {
    return state.deletedProjects
  }
}

const mutations = {
  setSelectedProject (state, uuid) {
    state.selected = uuid
  },
  setSelectedProjectName (state, name) {
    state.selectedProjectName = name
  },
  deleteProject (state, projectId) {
    let storedIds = state.subProjects[projectId]
    if (storedIds) {
      state.deletedProjects.push(...storedIds)
    }
  },
  createProjectDependencies (state, projects) {
    let getDescendantProjectIds = (project) => {
      let descendantProjectIds = []
      descendantProjectIds.push(project.id)
      if (project.children) {
        project.children.forEach(child => {
          let descendants = getDescendantProjectIds(child)
          descendantProjectIds.push(...descendants)
        })
      }
      return descendantProjectIds
    }
    projects.forEach(project => {
      let projectDependencies = state.subProjects[project.id]
      if (!projectDependencies) {
        state.subProjects[project.id] = []
      }
      let descendantProjectIds = getDescendantProjectIds(project)
      state.subProjects[project.id] = descendantProjectIds
      // And do the same for all its children:
      if (project.children) {
        mutations.createProjectDependencies(state, project.children)
      }
    })
  }
}

export default {
  state,
  mutations,
  getters
}

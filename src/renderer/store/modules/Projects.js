import Vue from 'vue'

const state = {
  // INBOX is by default selected
  selected: 1,
  selectedProjectName: 'INBOX',
  subProjects: {},
  deletedProjects: [],
  projectNames: {}
}

const getters = {
  getSelectedProject (state) {
    return state.selected
  },
  getSelectedProjectName (state) {
    return state.selectedProjectName
  },
  getProjectName (state) {
    let getProjectNameTemp = (id) => {
      return state.projectNames[id]
    }
    return getProjectNameTemp
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
    // Unselect the project if it was deleted so it disappears from the middle pane
    if (storedIds.includes(state.selected)) {
      state.selected = 1
      state.selectedProjectName = 'INBOX'
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
  },
  createProjectNames (state, projects) {
    projects.forEach(project => {
      console.log('setting project name of id ' + project.id + ' to ' + project.name)
      Vue.set(state.projectNames, project.id, project.name)
      // And do the same for all its children:
      if (project.children) {
        mutations.createProjectNames(state, project.children)
      }
    })
  },
  setProjectName (state, project) {
    console.log('setting project name in store ' + project.name)
    Vue.set(state.projectNames, project.id, project.name)
  }
}

export default {
  state,
  mutations,
  getters
}

import Vue from 'vue'

const state = {
  // All Projects is by default selected
  selected: 2,
  selectedProjectName: 'All Projects',
  subProjects: {},
  deletedProjects: [],
  projectNames: {},
  projectTargetTaskDrag: null,
  // Expand All Projects initially
  expanded: {'today': true, 'thisweek': true},
  selectedTaskTab: 'someday',
  selectedTaskId: null,
  focusedTime: {}
}

const getters = {
  getSelectedTaskTab (state) {
    return state.selectedTaskTab
  },
  getSelectedTaskId (state) {
    return state.selectedTaskId
  },
  getSelectedProject (state) {
    return state.selected
  },
  getProjectTargetTaskDrag (state) {
    return state.projectTargetTaskDrag
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
  isExpanded (state) {
    let isExpandedTemp = (projectIdOrTaskTab) => {
      return state.expanded[projectIdOrTaskTab]
    }
    return isExpandedTemp
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
  },
  getFocusedTimeToday (state) {
    let today = Vue.moment().format('YYYY-MM-DD')
    console.log('getting focused time today: ' + today)
    return state.focusedTime[today]
  }
}

const mutations = {
  setSelectedTaskId (state, id) {
    state.selectedTaskId = id
  },
  setSelectedTaskTab (state, when) {
    state.selectedTaskTab = when
  },
  setSelectedProject (state, uuid) {
    state.selected = uuid
  },
  setExpanded (state, projectIdOrTaskTab) {
    Vue.set(state.expanded, projectIdOrTaskTab.what, projectIdOrTaskTab.state)
  },
  setProjectTargetTaskDrag (state, project) {
    state.projectTargetTaskDrag = project
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
  createFocusedTime (state, focusedTime) {
    // focusedTime is a list of objects {'date': <date>, 'timeInSeconds': <numberInSeconds>} for each date.
    // We're just storing today for now; later on we can do more.
    focusedTime.forEach(focusedTimeObject => {
      const date = focusedTimeObject['date']
      const timeInSeconds = focusedTimeObject['timeInSeconds']
      const today = Vue.moment().format('YYYY-MM-DD')
      if (date === today) {
        Vue.set(state.focusedTime, today, timeInSeconds)
        console.log('store: set focusedTime for ' + date + ' to ' + timeInSeconds + ' seconds')
      }
    })
  },
  addFocusedTimeToday (state, sessionSeconds) {
    const today = Vue.moment().format('YYYY-MM-DD')
    let currentSeconds
    if (state.focusedTime[today]) {
      currentSeconds = state.focusedTime[today]
    } else {
      currentSeconds = 0
    }
    Vue.set(state.focusedTime, today, currentSeconds + sessionSeconds)
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
        Vue.set(state.subProjects, project.id, [])
      }
      let descendantProjectIds = getDescendantProjectIds(project)
      Vue.set(state.subProjects, project.id, descendantProjectIds)
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

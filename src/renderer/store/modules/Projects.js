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
  expanded: { today: true, thisweek: true },
  selectedTaskTab: 'someday',
  selectedTaskId: null,
  focusedTime: {},
  editingNote: false
}

const getters = {
  isEditingNote (state) {
    return state.editingNote
  },
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
    const getProjectNameTemp = (id) => {
      return state.projectNames[id]
    }
    return getProjectNameTemp
  },
  isExpanded (state) {
    const isExpandedTemp = (projectIdOrTaskTab) => {
      return state.expanded[projectIdOrTaskTab]
    }
    return isExpandedTemp
  },
  getStoredDescendantProjectIdsOfSelected (state) {
    if (!state.selected) {
      return []
    }
    const descendantsIncludingSelected = [state.selected]
    const storedIds = state.subProjects[state.selected]
    if (storedIds) {
      descendantsIncludingSelected.push(...storedIds)
    }
    return descendantsIncludingSelected
  },
  getDeletedProjects (state) {
    return state.deletedProjects
  },
  getFocusedTimeToday (state) {
    const today = Vue.prototype.$moment().format('YYYY-MM-DD')
    console.log('getting focused time today: ' + today)
    return state.focusedTime[today]
  },
  getFocusedTimeThisWeek (state) {
    const today = Vue.prototype.$moment()
    return getters.getFocusedTime(state, today)
  },
  getFocusedTime (state, day) {
    const dayNumber = day.day()
    const thisDay = day.format('YYYY-MM-DD')
    let thisDaySeconds
    if (state.focusedTime[thisDay]) {
      thisDaySeconds = state.focusedTime[thisDay]
    } else {
      thisDaySeconds = 0
    }
    console.log('getting focused time for week calculation for: ' + thisDay + ' is ' + thisDaySeconds)
    if (dayNumber === 1) {
      return thisDaySeconds
    } else {
      const yesterday = day.subtract(1, 'days')
      return thisDaySeconds + getters.getFocusedTime(state, yesterday)
    }
  }
}

const mutations = {
  setEditingNote (state, stateChange) {
    state.editingNote = stateChange
  },
  setSelectedTaskId (state, id) {
    state.selectedTaskId = id
  },
  unsetSelectedTaskId (state) {
    state.selectedTaskId = null
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
  setPathFromRootToProjectExpanded (state, projectId) {
    for (const id in state.subProjects) {
      const subProjects = state.subProjects[id]
      if (subProjects.includes(projectId)) {
        Vue.set(state.expanded, id, true)
      } else {
        // and close everything else
        Vue.set(state.expanded, id, false)
      }
    }
  },
  setProjectTargetTaskDrag (state, project) {
    state.projectTargetTaskDrag = project
  },
  setSelectedProjectName (state, name) {
    state.selectedProjectName = name
  },
  deleteProject (state, projectId) {
    const storedIds = state.subProjects[projectId]
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
    focusedTime.forEach(focusedTimeObject => {
      const date = focusedTimeObject.date
      const timeInSeconds = focusedTimeObject.timeInSeconds
      Vue.set(state.focusedTime, date, timeInSeconds)
      console.log('store: set focusedTime for ' + date + ' to ' + timeInSeconds + ' seconds')
    })
  },
  addFocusedTimeToday (state, sessionSeconds) {
    const today = Vue.prototype.$moment().format('YYYY-MM-DD')
    let currentSeconds
    if (state.focusedTime[today]) {
      currentSeconds = state.focusedTime[today]
    } else {
      currentSeconds = 0
    }
    Vue.set(state.focusedTime, today, currentSeconds + sessionSeconds)
  },
  createProjectDependencies (state, projects) {
    const getDescendantProjectIds = (project) => {
      const descendantProjectIds = []
      descendantProjectIds.push(project.id)
      if (project.children) {
        project.children.forEach(child => {
          const descendants = getDescendantProjectIds(child)
          descendantProjectIds.push(...descendants)
        })
      }
      return descendantProjectIds
    }
    projects.forEach(project => {
      const projectDependencies = state.subProjects[project.id]
      if (!projectDependencies) {
        Vue.set(state.subProjects, project.id, [])
      }
      const descendantProjectIds = getDescendantProjectIds(project)
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

const uuid = require('uuid')

class TestActions {
  /**
   * Create a TestActions object with a Spectron app.
   * @constructor
   * @param {module:spectron.Application} app - The spectron app that is driving the integration tests
   */
  constructor (app) {
    this.app = app
  }

  /**
   * Add a subproject with name to the All Projects project
   * @param {string} name - The name of the subproject that is added
   * @returns {Promise<void>}
   */
  async addSubProjectToAllProjects (name) {
    await this.addSubProject('All Projects')
    await this.renameProject('new project', name)
  }

  /**
   * Add a task without caring about which project.
   * @param {string} taskName - The name of the task to add
   * @returns {Promise<void>}
   */
  async addTask (taskName) {
    const taskInput = await this.app.client.$('.taskInput')
    await taskInput.setValue(taskName)
    await this.app.client.keys('Enter')
  }

  /**
   * Add a task with taskName to the projectName
   * @param {string} projectName - The name of the project to add the task to
   * @param {string} taskName - The name of the task to add
   * @returns {Promise<void>}
   */
  async addTaskToProject (projectName, taskName) {
    const project = await this.app.client.$('span*=' + projectName)
    await project.click() // select the project
    await this.addTask(taskName)
  }

  /**
   * Archive a task with taskName
   * @param {string} taskName - The name of the task to archive
   * @returns {Promise<void>}
   */
  async archiveTask (taskName) {
    const taskSummary = await this.app.client.$('.taskSummary*=' + taskName)
    const taskCheckBox = await (await taskSummary.previousElement()).previousElement()
    const checkboxInput = await taskCheckBox.$('input')
    await checkboxInput.click()

    // now mark as complete
    const archiveTaskButton = await this.app.client.$('button.archiveTasks')
    await archiveTaskButton.click()
  }

  /**
   * Rename a project
   * @param {string} oldProjectName - The project to be renamed
   * @param {string} newProjectName - The new project name
   * @returns {Promise<void>}
   */
  async renameProject (oldProjectName, newProjectName) {
    // note that this assumes there's only 1 thing with this oldProjectName really
    const oldProjectElement = await this.app.client.$('span*=' + oldProjectName)
    await oldProjectElement.click({ button: 'right' })
    const renameProjectItem = await this.app.client.$('[data-icon="pencil-alt"]')
    await renameProjectItem.click()

    // Now that you have the focus, throw in the name
    await this.app.client.keys(newProjectName)
    await this.app.client.keys('Enter')
  }

  /**
   * Add a sub project to a project
   * @param {string} parentName - The project to add the subproject to
   * @returns {Promise<void>}
   */
  async addSubProject (parentName) {
    const parentElement = await this.app.client.$('span*=' + parentName)
    await parentElement.click({ button: 'right' })
    const addProjectMenuItem = await this.app.client.$('[data-icon="folder-plus"]')
    await addProjectMenuItem.click()
  }

  /**
   * Get a unique name.
   * @returns {string}
   */
  uniqueName () {
    return 'test ' + uuid.v4()
  }
}

module.exports = TestActions

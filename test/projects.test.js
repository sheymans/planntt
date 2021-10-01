const assert = require('assert')
const path = require('path')
const Application = require('spectron').Application
const electronPath = require('electron')
const TestActions = require('./test_actions')

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '..')]
})

const actions = new TestActions(app)

describe('planntt projects', function () {
  // timeout and fail tests after 10 seconds
  this.timeout(10000)

  before(() => {
    return app.start()
  })

  after(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  it('shows an initial window', async () => {
    const count = await app.client.getWindowCount()
    assert.strictEqual(count, 1)
  })

  it('has title planntt', async () => {
    const title = await app.client.getTitle()
    assert.strictEqual(title, 'planntt')
  })

  it('has an input field to add tasks', async () => {
    const taskInputs = await app.client.$$('.taskInput')
    assert.strictEqual(taskInputs.length, 1)
  })

  it('has an input field to add tasks with correct placeholder', async () => {
    const taskInput = await app.client.$('.taskInput')
    const placeholder = await taskInput.getAttribute('placeholder')
    assert.strictEqual(placeholder, 'Filter tasks/press enter to add a new task')
  })

  it('can add a new task that appears by default in Someday list', async () => {
    // Add a task name in the input field and click enter
    const taskName = actions.uniqueName()
    await actions.addTask(taskName)

    // It should appear in the some day list now:
    const somedayTasks = await app.client.$$('.somedayList .tasksInTab')
    assert.strictEqual(somedayTasks.length, 1)
    const addedTask = somedayTasks[0]
    const taskSummary = await addedTask.$('div.taskSummary*=' + taskName)
    assert.strictEqual(await taskSummary.getText(), taskName)
  })

  it('can create a sub project of All Projects with a name', async () => {
    const projectName = actions.uniqueName()
    await actions.addSubProjectToAllProjects(projectName)
    const newlyAddedProject = await app.client.$('span*=' + projectName)
    assert.strictEqual(await newlyAddedProject.getText(), projectName)
  })

  it('can add a task to a particular project', async () => {
    const projectName = actions.uniqueName()
    const taskName = actions.uniqueName()
    await actions.addSubProjectToAllProjects(projectName)
    await actions.addTaskToProject(projectName, taskName)

    // get the task and verify its project
    const taskSummary = await app.client.$('div.taskSummary*=' + taskName)
    const projectLabel = await taskSummary.previousElement()
    assert.strictEqual(await projectLabel.getText(), projectName)
  })

  it('can archive a task', async () => {
    const taskName = actions.uniqueName()
    await actions.addTask(taskName)
    await actions.archiveTask(taskName)

    // go to archive and check
    const archiveLink = await app.client.$('.archive')
    await archiveLink.click()
    const taskSummary = await app.client.$('div.taskSummary*=' + taskName)
    assert.strictEqual(await taskSummary.getText(), taskName)

    // go back to projects
    const projectsLink = await app.client.$('.home')
    await projectsLink.click()
  })

  it('can rename a project', async () => {
    const originalProjectName = actions.uniqueName()
    await actions.addSubProjectToAllProjects(originalProjectName)

    const newProjectName = actions.uniqueName()
    await actions.renameProject(originalProjectName, newProjectName)

    const renamed = await app.client.$('span*=' + newProjectName)
    assert.strictEqual(await renamed.getText(), newProjectName)
  })

  it('can archive a task of a renamed project and task will be archived belonging to current project name', async () => {
    // add the original project
    const originalProjectName = actions.uniqueName()
    await actions.addSubProjectToAllProjects(originalProjectName)

    // add a task for it
    const taskName = actions.uniqueName()
    await actions.addTaskToProject(originalProjectName, taskName)

    // rename the project
    const newProjectName = actions.uniqueName()
    await actions.renameProject(originalProjectName, newProjectName)

    // archive the task
    await actions.archiveTask(taskName)

    // check that archived task has the latest project name
    const archiveLink = await app.client.$('.archive')
    await archiveLink.click()
    const taskSummary = await app.client.$('div.taskSummary*=' + taskName)
    assert.strictEqual(await taskSummary.getText(), taskName)

    const projectLabelElement = await taskSummary.previousElement()
    assert.strictEqual(await projectLabelElement.getText(), newProjectName + '[someday]') // note that this is newProjectName

    // go back to projects
    const projectsLink = await app.client.$('.home')
    await projectsLink.click()
  })
})

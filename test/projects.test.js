const assert = require('assert')
const path = require('path')
const Application = require('spectron').Application
const electronPath = require('electron')

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '..')]
})

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
    const taskInput = await app.client.$('.taskInput')
    const taskName = 'this is a test task name ' + Date.now()
    await taskInput.setValue(taskName)
    await app.client.keys('Enter')

    // It should appear in the some day list now:
    const somedayTasks = await app.client.$$('.somedayList .tasksInTab')
    assert.strictEqual(somedayTasks.length, 1)
    const addedTask = somedayTasks[0]
    const taskSummary = await addedTask.$('.taskSummary')
    assert.strictEqual(await taskSummary.getText(), taskName)
  })
})

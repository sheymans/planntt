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
    return assert.strictEqual(count, 1)
  })

  it('has an input field to add tasks', async () => {
    const taskInputs = await app.client.$$('.taskInput')
    return assert.strictEqual(taskInputs.length, 1)
  })

  it('has an input field to add tasks with correct placeholder', async () => {
    const taskInput = await app.client.$('.taskInput')
    const placeholder = await taskInput.getAttribute('placeholder')
    return assert.strictEqual(placeholder, 'Filter tasks/press enter to add a new task')
  })
})

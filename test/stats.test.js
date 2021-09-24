const assert = require('assert')
const path = require('path')
const Application = require('spectron').Application
const electronPath = require('electron')

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '..')]
})

describe('planntt stats', function () {
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

  // navigate to stats page before each test
  beforeEach(async () => {
    const statsLink = await app.client.$('.stats')
    await statsLink.click()
  })

  it('does not have Projects navigation menu selected', async () => {
    const projectsLink = await app.client.$('.home')
    const projectsLinkClasses = await projectsLink.getAttribute('class')
    assert.ok(!projectsLinkClasses.includes('router-link-exact-active'))
  })

  it('has stats navigation menu selected', async () => {
    const statsLink = await app.client.$('.stats')
    const statsLinkClasses = await statsLink.getAttribute('class')
    assert.ok(statsLinkClasses.includes('router-link-exact-active'))
  })
})

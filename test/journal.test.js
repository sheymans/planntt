const assert = require('assert')
const path = require('path')
const Application = require('spectron').Application
const electronPath = require('electron')

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '..')]
})

describe('planntt journal', function () {
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

  // navigate to journal page before each test
  beforeEach(async () => {
    const journalLink = await app.client.$('.journal')
    await journalLink.click()
  })

  it('does not have Projects navigation menu selected', async () => {
    const projectsLink = await app.client.$('.home')
    const projectsLinkClasses = await projectsLink.getAttribute('class')
    assert.ok(!projectsLinkClasses.includes('router-link-exact-active'))
  })

  it('has journal navigation menu selected', async () => {
    const journalLink = await app.client.$('.journal')
    const journalLinkClasses = await journalLink.getAttribute('class')
    assert.ok(journalLinkClasses.includes('router-link-exact-active'))
  })

  it('has an input field to add journal items', async () => {
    const journalInputs = await app.client.$$('.journalEntryInput')
    assert.strictEqual(journalInputs.length, 1)
  })

  it('has an input field to add journal items with correct placeholder', async () => {
    const journalInput = await app.client.$('.journalEntryInput')
    const placeholder = await journalInput.getAttribute('placeholder')
    assert.strictEqual(placeholder, 'Filter journal/press enter to add a new journal entry')
  })

  it('can add a new journal item', async () => {
    // Add a journal item name in the input field and click enter
    const journalInput = await app.client.$('.journalEntryInput')
    const journalName = 'this is a test journal input name ' + Date.now()
    await journalInput.setValue(journalName)
    await app.client.keys('Enter')

    // It should appear in the journal list now:
    const journalItems = await app.client.$$('.journalEntryDivisions')
    assert.strictEqual(journalItems.length, 1)
    const addedJournalItem = journalItems[0]
    const journalItemSummary = await addedJournalItem.$('.journalEntrySummary')
    assert.strictEqual(await journalItemSummary.getText(), journalName)
  })
})

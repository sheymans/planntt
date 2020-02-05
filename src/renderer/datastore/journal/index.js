import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

let dataLocation = remote.app.getPath('userData')
const fs = require('fs')
let contents = null

try {
  contents = JSON.parse(fs.readFileSync(remote.app.getPath('userData') + '/preferences.db').toString())
  if (contents) {
    dataLocation = contents['dataLocation']
    console.log('using data location: ' + dataLocation)
  }
} catch (err) {
  console.log('no preferences.db exists')
}

export default new Datastore({
  autoload: true,
  filename: path.join(dataLocation, '/journal.db')
})

import Datastore from 'nedb'
import path from 'path'

const app = require('@electron/remote').app
let dataLocation = app.getPath('userData')
const fs = require('fs')
let contents = null

try {
  contents = JSON.parse(fs.readFileSync(app.getPath('userData') + '/preferences.db').toString())
  if (contents) {
    dataLocation = contents['dataLocation']
    console.log('using data location: ' + dataLocation)
  }
} catch (err) {
  console.log(err)
  console.log('no preferences.db exists')
}

export default new Datastore({
  autoload: true,
  filename: path.join(dataLocation, '/projects.db')
})

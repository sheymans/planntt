import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
import preferences from '../preferences'

let dataLocation = remote.app.getPath('userData')

preferences.find({}, function (err, docs) {
  if (err) {
    console.log(err.stack)
    return
  }
  if (!docs || docs.length === 0) {
    // doing nothing, no specific preferences were changed so using default Location
    console.log('no preferences specified using data location for projects: ' + dataLocation)
  } else {
    let dataLocationObject = docs[0]
    dataLocation = dataLocationObject['dataLocation']
    console.log('using data location for projects: ' + dataLocation)
  }
})

export default new Datastore({
  autoload: true,
  filename: path.join(dataLocation, '/projects.db')
})

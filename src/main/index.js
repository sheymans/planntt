'use strict'

import { app, BrowserWindow, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

// for using remote, see https://github.com/electron/remote
require('@electron/remote/main').initialize()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// Open links using user's preferred application
const open = require('open')

// Icons
const path = require('path')

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : path.join('file://', __dirname, path.sep, 'index.html')

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true
    },
    backgroundColor: '#FFFFFF'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // https://github.com/electron/electron/issues/1344
  // Open any new window requests in the browser's window
  mainWindow.webContents.on('new-window', function (event, url) {
    event.preventDefault()
    open(url)
  })

  // Get in custom menu
  require('./menu/mainmenu')

  // Open dev tools initially when in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      mainWindow.webContents.once('devtools-opened', () => {
        mainWindow.focus()
      })
      mainWindow.webContents.openDevTools()
    })
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * ensureSafeQuitAndInstall
 *
 * @access  public
 * @return  void
 */
function ensureSafeQuitAndInstall () {
  app.removeAllListeners('window-all-closed')
  const browserWindows = BrowserWindow.getAllWindows()
  browserWindows.forEach(browserWindow => {
    browserWindow.removeAllListeners('close')
  })
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'plannt Update',
    message: 'planntt Update',
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((data) => {
    const response = data.response
    if (response === 0) {
      ensureSafeQuitAndInstall()
      autoUpdater.quitAndInstall()
    }
  })
})

app.on('ready', () => {
  console.log('environment: ' + process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})

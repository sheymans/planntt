/**
 * This file is used specifically and only for development. It installs
 * `electron-debug`.
 */

/* eslint-disable */

// Set environment for development
process.env.NODE_ENV = 'development'

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

// Require `main` process to boot app
require('./index')

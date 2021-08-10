import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import projectDb from './datastore/projects'
import taskDb from './datastore/tasks'
import archivedTaskDb from './datastore/archivedTasks'
import focusedTime from './datastore/focusedTime'
import journal from './datastore/journal'
import 'typeface-roboto/index.css'
import 'typeface-roboto-mono/index.css'
import 'typeface-raleway/index.css'
import 'typeface-jetbrains-mono/dist/index.css'
import VModal from 'vue-js-modal'

/* Fonts */
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSpinner, faFolder, faFolderOpen, faPencilAlt,
  faCaretDown, faCaretRight, faHeadphones,
  faTimes, faClone, faBan, faCrosshairs,
  faArrowLeft, faTrashAlt, faCheck, faArrowUp, faArrowDown, faClipboard
} from '@fortawesome/free-solid-svg-icons'
import { faFolder as faFolderReg, faFolderOpen as faFolderOpenReg } from '@fortawesome/free-regular-svg-icons'

import '@chartshq/muze/dist/muze.css'
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css'

library.add(faClipboard, faSpinner, faFolder, faFolderOpen, faPencilAlt, faFolderReg, faFolderOpenReg, faCaretDown, faCaretRight, faClone, faBan, faHeadphones, faTimes, faCrosshairs, faArrowLeft, faTrashAlt, faCheck, faArrowUp, faArrowDown)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(require('vue-moment'))
Vue.use(VModal)
Vue.use(Tooltip)
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$projectDb = projectDb
Vue.prototype.$taskDb = taskDb
Vue.prototype.$archivedTaskDb = archivedTaskDb
Vue.prototype.$focusedTime = focusedTime
Vue.prototype.$journal = journal

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

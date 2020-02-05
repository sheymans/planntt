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
import VModal from 'vue-js-modal'

/* Fonts */
import fontawesome from '@fortawesome/fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faFolder from '@fortawesome/fontawesome-free-solid/faFolder'
import faFolderOpen from '@fortawesome/fontawesome-free-solid/faFolderOpen'
import faFolderReg from '@fortawesome/fontawesome-free-regular/faFolder'
import faFolderOpenReg from '@fortawesome/fontawesome-free-regular/faFolderOpen'
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown'
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight'
import faHeadphones from '@fortawesome/fontawesome-free-solid/faHeadphones'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faClone from '@fortawesome/fontawesome-free-solid/faClone'
import faBan from '@fortawesome/fontawesome-free-solid/faBan'
import faCrosshairs from '@fortawesome/fontawesome-free-solid/faCrosshairs'
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import faArrowUp from '@fortawesome/fontawesome-free-solid/faArrowUp'
import faArrowDown from '@fortawesome/fontawesome-free-solid/faArrowDown'
import 'muze/dist/muze.css'
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'

fontawesome.library.add(faSpinner, faFolder, faFolderOpen, faFolderReg, faFolderOpenReg, faPencilAlt, faCaretDown, faCaretRight, faClone, faBan, faHeadphones, faTimes, faCrosshairs, faArrowLeft, faTrashAlt, faCheck, faArrowUp, faArrowDown)

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

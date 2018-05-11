import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import projectDb from './datastore/projects'
import taskDb from './datastore/tasks'
import 'bulma/css/bulma.css'

import fontawesome from '@fortawesome/fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faFolder from '@fortawesome/fontawesome-free-solid/faFolder'
import faFolderOpen from '@fortawesome/fontawesome-free-solid/faFolderOpen'
import faFolderReg from '@fortawesome/fontawesome-free-regular/faFolder'
import faFolderOpenReg from '@fortawesome/fontawesome-free-regular/faFolderOpen'
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt'

fontawesome.library.add(faSpinner, faFolder, faFolderOpen, faFolderReg, faFolderOpenReg, faPencilAlt)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$projectDb = projectDb
Vue.prototype.$taskDb = taskDb

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

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

// tooltips
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

library.add(faClipboard, faSpinner, faFolder, faFolderOpen, faPencilAlt, faFolderReg, faFolderOpenReg, faCaretDown, faCaretRight, faClone, faBan, faHeadphones, faTimes, faCrosshairs, faArrowLeft, faTrashAlt, faCheck, faArrowUp, faArrowDown)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// Vue.use statements are used when the packages you want to include are Vue plugins
Vue.use(require('vue-moment'))
Vue.use(VModal)

// We can include NPM packages directly and make them available in Vue components by this.$http (for example). The $ is
// just convention for that they are public (not Vue internal).
// Note that we use Object.defineProperty as the default is then that this.$http (for example) is not re-assignable.
// see https://vuejsdevelopers.com/2017/04/22/vue-js-libraries-plugins/ for more explanation.
Object.defineProperty(Vue.prototype, '$http', { value: axios })
Vue.http = Vue.prototype.$http // I do not know why we assign Vue.http TODO

// What does this do? TODO
Object.defineProperty(Vue.config, 'productionTip', { value: false })

// Making my stores locally available using this.$projectDB for example
Object.defineProperty(Vue.prototype, '$projectDb', { value: projectDb })
Object.defineProperty(Vue.prototype, '$taskDb', { value: taskDb })
Object.defineProperty(Vue.prototype, '$archivedTaskDb', { value: archivedTaskDb })
Object.defineProperty(Vue.prototype, '$focusedTime', { value: focusedTime })
Object.defineProperty(Vue.prototype, '$journal', { value: journal })

// Make v-tippy="the text of the tooltip" available in all components
Vue.directive('tipster', {
  bind: function (el, binding, vnode) {
    // call tippy and tell it to put the tooltip with content binding.value (your tooltip text) on the eld.
    tippy(el, {
      content: binding.value
    })
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

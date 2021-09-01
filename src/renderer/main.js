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
  faArrowLeft, faTrashAlt, faCheck, faArrowUp, faArrowDown, faClipboard,
  faTrash, faFolderPlus
} from '@fortawesome/free-solid-svg-icons'
import { faFolder as faFolderReg, faFolderOpen as faFolderOpenReg } from '@fortawesome/free-regular-svg-icons'

import '@chartshq/muze/dist/muze.css'

// tooltips
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

// moment (for time)
import moment from 'moment'

library.add(faFolderPlus, faTrash, faClipboard, faSpinner, faFolder, faFolderOpen, faPencilAlt, faFolderReg, faFolderOpenReg, faCaretDown, faCaretRight, faClone, faBan, faHeadphones, faTimes, faCrosshairs, faArrowLeft, faTrashAlt, faCheck, faArrowUp, faArrowDown)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// Vue.use statements are used when the packages you want to include are Vue plugins
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

// Make moment available as this.$moment everywhere.
Object.defineProperty(Vue.prototype, '$moment', { value: moment })

// Make v-tipster="the text of the tooltip" available in all components
Vue.directive('tipster', {
  bind: function (el, binding, vnode) {
    // call tippy and tell it to put the tooltip with content binding.value (your tooltip text) on the eld.
    if (binding.value) { // if it's empty don't show anything, for use with v-tipster="''"
      tippy(el, {
        content: binding.value,
        theme: 'planntt' // theme is defined in App.vue
      })
    }
  }
})

// Tippy context menu v-contextmenu
Vue.directive('contextmenu', {
  bind: function (el, binding, vnode) {
    const tippyInstance = tippy(el, {
      content (reference) {
        // pick up the icons
        const icons = vnode.context.$refs.projectMenu
        // if you do not unhide it, events like clicking on icons will not be present
        icons.removeAttribute('hidden')
        // return icons rather than icons.innerHTML cause that'd lose the events on the icons.
        return icons
      },
      placement: 'bottom',
      trigger: 'manual',
      interactive: true,
      arrow: false,
      offset: [0, 0],
      allowHTML: true,
      theme: 'planntt-menu'
    })

    // listen to right-click and open the context menu (the tippy)
    el.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      tippyInstance.show()
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

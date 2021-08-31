import { createApp } from 'vue'
import axios from 'axios'

import App from './App'
import { router } from './router'
import { store } from './store'
import projectDb from './datastore/projects'
import taskDb from './datastore/tasks'
import archivedTaskDb from './datastore/archivedTasks'
import focusedTime from './datastore/focusedTime'
import journal from './datastore/journal'
import 'typeface-roboto/index.css'
import 'typeface-roboto-mono/index.css'
import 'typeface-raleway/index.css'
import 'typeface-jetbrains-mono/dist/index.css'

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

// The Vue app
const app = createApp(App)

// Use the vue-router
app.use(router)

// Use the Vuex store
app.use(store)

// We can include NPM packages directly and make them available in Vue components by this.$http (for example). The $ is
// just convention for that they are public (not Vue internal).
// Note that we use Object.defineProperty as the default is then that this.$http (for example) is not re-assignable.
// see https://vuejsdevelopers.com/2017/04/22/vue-js-libraries-plugins/ for more explanation.
Object.defineProperty(app.config.globalProperties, '$http', { value: axios })
// app.http = app.config.globalProperties.$http // I do not know why we assign app.http TODO

// Making my stores locally available using this.$projectDB for example
Object.defineProperty(app.config.globalProperties, '$projectDb', { value: projectDb })
Object.defineProperty(app.config.globalProperties, '$taskDb', { value: taskDb })
Object.defineProperty(app.config.globalProperties, '$archivedTaskDb', { value: archivedTaskDb })
Object.defineProperty(app.config.globalProperties, '$focusedTime', { value: focusedTime })
Object.defineProperty(app.config.globalProperties, '$journal', { value: journal })

// Make moment available as this.$moment everywhere.
Object.defineProperty(app.config.globalProperties, '$moment', { value: moment })
// yes also in the store where you access it with this.$store then.
store.$moment = moment

// Make v-tipster="the text of the tooltip" available in all components
app.directive('tipster', {
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
app.directive('contextmenu', {
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

// Mount the app
app.mount('#app')

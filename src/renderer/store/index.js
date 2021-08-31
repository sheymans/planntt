import { createStore } from 'vuex'
import modules from './modules'

export const store = createStore({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

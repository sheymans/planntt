import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: require('@/components/MainPage').default
    },
    {
      path: '/journal',
      name: 'journal',
      component: require('@/components/Journal').default
    },
    {
      path: '/archive',
      name: 'archive',
      component: require('@/components/Archive').default
    },
    {
      path: '/deadlines',
      name: 'deadlines',
      component: require('@/components/Deadlines').default
    },
    {
      path: '/stats',
      name: 'stats',
      component: require('@/components/Stats').default
    },
    {
      path: '/focusTask',
      name: 'focusTask',
      component: require('@/components/FocusTask').default,
      props: true
    },
    {
      path: '/focusJournalEntry',
      name: 'focusJournalEntry',
      component: require('@/components/FocusJournalEntry').default,
      props: true
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

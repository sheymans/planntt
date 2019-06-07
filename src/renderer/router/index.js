import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/landing-page',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/',
      name: 'main-page',
      component: require('@/components/MainPage').default
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
      path: '*',
      redirect: '/'
    }
  ]
})

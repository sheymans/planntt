<template>
    <div id="mainPage">
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item">
                    <!--<img src="https://bulma.io/images/bulma-logo.png" alt="planntt: automatic scheduling" width="112" height="28">-->
                    <tt>planntt</tt>
                </a>
            </div>
        </nav>
        <section>
            <div class="container">
                <div class="columns">
                    <div class="column">
                        <ProjectList/>
                    </div>
                    <div class="column">
                        <TaskList/>
                    </div>
                    <div class="column">
                        <TaskDetail/>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
  import ProjectList from './ProjectList.vue'
  import TaskList from './TaskList.vue'
  import Planntt from '../App'
  import TaskDetail from './TaskDetail.vue'

  export default {
    name: 'MainPage',
    components: {
      TaskDetail,
      Planntt,
      ProjectList,
      TaskList
    },
    data () {
      return {
        person: 'molly heymans',
        person2: 'charlie heymans'
      }
    }
  }
</script>

<style scoped>

</style>
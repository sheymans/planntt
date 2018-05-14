<template>
    <div id="mainPage">
        <div class="header"><tt>planntt</tt></div>
        <div class="content">
            <div class="projectList">
                <ProjectList/>
            </div>
            <TaskList/>
        </div>
    </div>
</template>

<script>
  import ProjectList from './ProjectList.vue'
  import TaskList from './TaskList.vue'
  import Planntt from '../App'

  export default {
    name: 'MainPage',
    components: {
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

    .content {
    }

    .projectList {
        float: left;
        width: 20%;
        overflow: auto;
    }

</style>
<template>
    <div id="mainPage">
        <div class="header">
            <img id="logo" src="~@/assets/planntt.png" alt="planntt">
        </div>
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

    #mainPage {
        font-family: 'Raleway';
        font-style: normal;
        font-weight: 500;
        font-size: 10pt;
        -webkit-font-smoothing: antialiased;
    }

    .content {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 200px 1fr;
        grid-template-areas: "projectList   taskList";
    }

    .projectList {
        grid-area: projectList
    }

    #logo {
        width: 80px;
        height: auto;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-top: 10px;
    }

</style>
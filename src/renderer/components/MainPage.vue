<template>
    <div id="mainPage">
        <div class="columns">
            <div class="column">
                <ProjectList/>
            </div>
            <div class="column">
                TODO: list of things in selected project for {{person}}
            </div>
            <div class="column">
                TODO: detail of selected item in list
            </div>
        </div>
    </div>
</template>

<script>
  import ProjectList from './ProjectList.vue'

  export default {
    name: 'MainPage',
    components: {
      ProjectList
    },
    data () {
      return {
        person: 'stijn'
      }
    }
  }
</script>

<style scoped>

</style>
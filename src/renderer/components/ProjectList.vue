<template>
    <ul v-if="projects.length">
        <Project
                v-for="project in projects"
                :key="project.id"
                :project="project"
        />
    </ul>
</template>

<script>
  import Project from './Project.vue'

  export default {
    name: 'ProjectList',
    components: {
      Project
    },
    data () {
      return {
        projects: [
          {
            id: 1,
            name: 'Test Project1'
          },
          {
            id: 2,
            name: 'Test Project2'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
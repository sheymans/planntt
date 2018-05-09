<template>
    <ol v-if="projects.length">
        <Project
                v-for="project in projects"
                :key="project.id"
                :project="project"/>
    </ol>
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
          {name: 'INBOX', id: 11},
          {
            name: 'All Projects',
            children: [
              {
                id: 1,
                name: 'Test Project1',
                children: [
                  {
                    id: 4,
                    name: 'Child Project 1'
                  }
                ]
              },
              {
                id: 2,
                name: 'Test Project2'
              },
              {
                id: 3,
                name: 'Test Project3'
              }
            ]
          }]
      }
    }
  }
</script>

<style scoped>

</style>
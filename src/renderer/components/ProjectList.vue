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
        projects: []
      }
    },
    mounted () {
      let self = this
      this.$projectDb.find({}, function (err, docs) {
        if (err) {
          console.log(err.stack)
          return
        }
        if (!docs || docs.length === 0) {
          let inbox = {name: 'INBOX', id: 1}
          let allProjects = {name: 'All Projects', id: 2}
          self.projects = [inbox, allProjects]
          self.$projectDb.insert(inbox)
          self.$projectDb.insert(allProjects)
          console.log('created new project list cause none was there: ' + self.projects)
        } else {
          self.projects = docs.sort({id: 1})
          console.log('read existing project list from db:' + self.projects)
        }
      })
    }
  }
</script>

<style scoped>

</style>
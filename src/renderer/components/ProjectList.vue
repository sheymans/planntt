<template>
    <nav class="panel">
        <ul v-if="projects.length">
            <Project
                    v-for="project in projects"
                    :key="project.id"
                    :project="project"
                    @removeFromRoot="removeFromRoot"
                    @updateProjects="updateProjectDb"/>
        </ul>
    </nav>
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
    created () {
      // Load the data
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
          console.log('created new project list cause none was there.')
        } else {
          self.projects = docs
          self.projects.sort((project1, project2) => project1.id - project2.id)
          console.log('read existing project list from db')
          self.$store.commit('createProjectDependencies', self.projects)
          console.log('created project dependencies')
          self.$store.commit('createProjectNames', self.projects)
          console.log('created project names')
        }
      })
    },
    methods: {
      updateProjectDb: function () {
        //  runs after event on any child Project component https://alligator.io/vuejs/component-lifecycle/
        // We save the project lists here.
        console.log('writing to Project DB')
        this.$projectDb.update({id: 1}, this.projects[0])
        this.$projectDb.update({id: 2}, this.projects[1])
        console.log('updating project dependencies in store')
        this.$store.commit('createProjectDependencies', this.projects)
      },
      removeFromRoot: function (uuid) {
        let removeFromChildren = function (project, id) {
          if (!project.children) {
            return
          }
          let childrenIds = project.children.map(p => p.id)
          if (childrenIds.includes(id)) {
            let filtered = project.children.filter(p => p.id !== uuid)
            project.children = filtered
            console.log('uuid ' + uuid + ' removed from root.')
          } else {
            project.children.forEach(p => removeFromChildren(p, id))
          }
        }
        this.projects.forEach(p => removeFromChildren(p, uuid))
        this.updateProjectDb()
      }
    }
  }
</script>

<style scoped>
    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
    }

</style>
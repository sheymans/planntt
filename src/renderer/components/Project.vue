import Vue from 'vue'

<template>
    <li>
        <div>
            <span @click="toggle">
                <font-awesome-icon :icon="getFolderIcon"/>
            </span>
            <span v-show="!editing"
                  @contextmenu.prevent="$refs.ctxMenu.open"
                  @click="selectProject"
                  @dblclick="startEdit"
                  :class="{selected: isSelectedProject}">
                {{ project.name }}</span>
            <input v-show="editing"
                   type="text"
                   class="input is-rounded"
                   v-model="project.name"
                   @blur="doneEdit"
                   @keyup.enter="doneEdit"
                   @keyup.esc="cancelEdit"
                   @focus="$event.target.select()"
                   v-focus="editing"/>
        </div>
        <ul v-show="open" v-if="isNonEmptyFolder">
            <Project
                    class="project"
                    v-for="(project, index) in project.children"
                    :key="index"
                    :project="project"
                    @remove="removeChild"
                    @updateProjects="updateProjects">
            </Project>
        </ul>
        <context-menu id="context-menu" ref="ctxMenu">
    <li @click="addSubProject">Add subproject</li>
    <li v-if="!isSpecialProject()" @click="$emit('remove', project.id)">Remove</li>
    </context-menu>
    </li>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import contextMenu from 'vue-context-menu'

  export default {
    name: 'Project',
    components: {FontAwesomeIcon, contextMenu},
    props: {
      project: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        open: false,
        editing: false
      }
    },
    computed: {
      isNonEmptyFolder: function () {
        return this.project.children &&
          this.project.children.length
      },
      getFolderIcon: function () {
        if (this.open && this.isNonEmptyFolder) {
          return 'folder-open'
        } else if (!this.open && this.isNonEmptyFolder) {
          return 'folder'
        } else {
          return ['far', 'folder']
        }
      },
      isSelectedProject: function () {
        let currentlySelected = this.$store.getters.getSelectedProject
        return (currentlySelected === this.project.id)
      }
    },
    methods: {
      toggle: function () {
        if (this.isNonEmptyFolder) {
          this.open = !this.open
        }
      },
      isInbox: function () {
        return this.project.id === 1
      },
      isSpecialProject: function () {
        // INBOX or All Projects
        return (this.project.id === 1 || this.project.id === 2)
      },
      selectProject: function () {
        // See store/modules/Projects.js for this Vuex store.
        // We should combine this in 1 call maybe just emit the whole project
        this.$store.commit('setSelectedProject', this.project.id)
        this.$store.commit('setSelectedProjectName', this.project.name)
        // Also reset the selected task when you switch project
        this.$store.commit('setSelectedTask', {})
      },
      addSubProject: function () {
        if (this.isNonEmptyFolder) {
          this.addChild()
        } else {
          this.$set(this.project, 'children', [])
          this.addChild()
        }
        this.open = true
      },
      addChild: function () {
        this.project.children.push({
          name: 'new project',
          id: this.uuidv4()
        })
        this.updateProjects()
      },
      removeChild: function (uuid) {
        let filtered = this.project.children.filter(p => p.id !== uuid)
        this.$set(this.project, 'children', filtered)
        this.$store.commit('deleteProject', uuid)
        this.updateProjects()
      },
      startEdit: function () {
        // You can't edit special projects
        if (this.isSpecialProject()) {
          console.log('you cannot edit special project: ' + this.project.id)
          return
        }
        console.log('starting to edit: ' + this.project.name)
        this.projectNameBeforeEdit = this.project.name
        this.editing = true
      },
      doneEdit: function () {
        if (!this.editing) {
          return
        }
        this.project.name = this.project.name.trim()
        if (!this.project.name) {
          this.cancelEdit()
        }
        this.editing = false
        this.projectNameBeforeEdit = null
        this.$store.commit('setSelectedProjectName', this.project.name)
        this.updateProjects()
      },
      cancelEdit: function () {
        this.project.name = this.projectNameBeforeEdit
        this.projectNameBeforeEdit = null
        this.editing = false
      },
      updateProjects: function () {
        // Saves stuff to DB on any change
        console.log('project with id ' + this.project.id + ' emitted an updateProjects save to DB')
        this.$emit('updateProjects')
      },
      // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
      uuidv4: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          let r = Math.random() * 16 | 0
          let v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }
    },
    // https://vuejs.org/v2/guide/custom-directive.html
    directives: {
      focus: function (el, binding) {
        if (binding.value) {
          el.focus()
        }
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

    .selected {
        background-color: black;
        color: white;
        border-radius: 10px;
        padding: 2px;
    }

</style>
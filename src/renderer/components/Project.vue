import Vue from 'vue'

<template>
    <li>
        <div>
            <span @click="toggle" :class="{selected: isSelectedProject, dragReady: dragHappening}">
                <font-awesome-icon :icon="getFolderIcon"/>
            </span>
            <span v-show="!editing"
                  @contextmenu.prevent="$refs.ctxMenu.open"
                  @click="selectProject"
                  @dblclick="startEdit"
                  class="hasContextMenu"
                  v-draggable="project"
                  v-droppable @drag-drop="handleDrop" @drag-over="handleDragOver" @drag-leave="handleDragLeave"
                  :class="{selected: isSelectedProject, dragReady: dragHappening}">
                {{ project.name }}</span>
            <input v-show="editing"
                   type="text"
                   :class="{selected: isSelectedProject}"
                   class="projectInput"
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
                    @removeFromRoot="removeFromRoot"
                    @updateProjects="updateProjects">
            </Project>
        </ul>
        <context-menu id="context-menu" ref="ctxMenu">
    <li @click="addSubProject">Add subfolder</li>
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
        editing: false,
        dragHappening: false
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
      handleDrop: function (object) {
        // The object is a task
        if (object.project) {
          this.handleDropTask(object)
        } else {
          this.handleDropProject(object)
        }
      },
      handleDropTask: function (task) {
        console.log('dropped task: ' + task.name + ' in project ' + this.project.name)
        task.project = this.project.id
        // If you're moving the selected task, unset the selection as you moved it.
        if (task.id === this.$store.getters.getSelectedTask.id) {
          this.$store.commit('setSelectedTask', {})
        }
      },
      handleDropProject: function (project) {
        console.log('dropping project: ' + project.name + ' in project ' + this.project.name)
        // You cannot drop All Project or INBOX something else
        if (project.id === 1 || project.id === 2) {
          return
        }
        // You cannot drop a project into itself
        if (this.project.id === project.id) {
          return
        }
        // Remove the project you want to drop from the tree
        this.removeFromRoot(project.id)
        // And add it now as a child of this project you're dropping it on
        if (!this.isNonEmptyFolder) {
          this.$set(this.project, 'children', [])
        }
        console.log('project that is added to children: ' + project)
        console.log('of this project: ' + this.project.name)
        this.project.children.push(project)
        this.updateProjects()
        this.open = true
      },
      handleDragOver: function (task, draggingPossible) {
        if (draggingPossible) {
          this.dragHappening = true
        }
      },
      handleDragLeave: function (task, draggingPossible) {
        if (draggingPossible) {
          this.dragHappening = false
        }
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
      // You want to drag something on this project and involves deleting a project with id uuid that could be somewhere entirely different
      // We want to go up to the root project list and from there we'll initiate a recursive removeChild, so any project here will just propogate the event up
      removeFromRoot: function (uuid) {
        this.$emit('removeFromRoot', uuid)
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
        this.$store.commit('setProjectName', this.project)
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

    li {
        list-style: none;
    }

    .selected {
        text-decoration: underline;
        color: forestgreen;
    }

    .dragReady {
        opacity: 0.5;
        color: forestgreen;
    }

    .hasContextMenu {
        cursor: context-menu;
    }

    input {
        font: inherit;
    }

    .projectInput {
        width: 100px;
    }

    input:focus {
        outline-color: chartreuse;
    }

    input::selection {
        background-color: chartreuse;
    }

    #context-menu {
        cursor: default;
    }

    #context-menu li {
        padding-left: 5px;
    }

    #context-menu li:hover {
        background-color: chartreuse;
    }

</style>
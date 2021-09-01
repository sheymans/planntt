import Vue from 'vue'

<template>
    <li>
        <div>
            <span @click="toggle" :class="{selected: isSelectedProject, dragReady: dragHappening}">
                <font-awesome-icon :icon="getFolderIcon"/>
            </span>
          <div hidden ref="projectMenu" class="projectEdits">
            <font-awesome-icon v-if="!isSpecialProject()" class="iconProjectEdits" v-tipster="'edit project'" @click="startEdit" icon="pencil-alt"/>
            <font-awesome-icon class="iconProjectEdits" v-tipster="'add subproject'" @click="addSubProject" icon="folder-plus"/>
            <font-awesome-icon v-if="!isSpecialProject()" class="iconProjectEdits" v-tipster="'delete project'" @click="trashIt" icon="trash"/>
          </div>
              <span v-show="!editing"
                  @click="selectProject"
                  @dblclick="toggle"
                  draggable="true"
                  @dragstart="dragProject"
                  @drop="handleDrop"
                  @dragover="handleDragOver"
                  @dragleave="handleDragLeave"
                  v-contextmenu
                  ref="projectName"
                  class="hasContextMenu"
                  :class="{selected: isSelectedProject, dragReady: dragHappening}">
                {{ project.name }}
              </span>
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
    </li>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'Project',
  components: { FontAwesomeIcon },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
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
      const currentlySelected = this.$store.getters.getSelectedProject
      return (currentlySelected === this.project.id)
    },
    open: function () {
      return this.$store.getters.isExpanded(this.project.id)
    }
  },
  methods: {
    trashIt: function () {
      this.closeMenu()
      this.$emit('remove', this.project.id)
    },
    toggle: function () {
      if (this.isNonEmptyFolder) {
        this.$store.commit('setExpanded', { what: this.project.id, state: !this.open })
      }
    },
    isInbox: function () {
      return this.project.id === 1
    },
    handleDrop: function (event) {
      event.preventDefault()
      const objectString = event.dataTransfer.getData('text')
      const object = JSON.parse(objectString)

      // The object is a task
      if (object.project) {
        this.handleDropTask(object)
      } else {
        this.handleDropProject(object)
      }
    },
    dragProject: function (event) {
      event.dataTransfer.setData('text', JSON.stringify(this.project))
    },
    handleDropTask: function (task) {
      console.log('dropped task: ' + task.name + ' in project ' + this.project.name)
      this.$set(task, 'project', this.project.id)
      this.$taskDb.update({ id: task.id }, { $set: { project: task.project, projectName: this.project.name } }, {})
      // we take a copy with Object.assign otherwise vuex thinks we're changing the store directly later, in addSubproject during addChild.
      this.$store.commit('setProjectTargetTaskDrag', Object.assign({}, this.project))
      this.dragHappening = false
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
      this.$store.commit('setExpanded', { what: this.project.id, state: true })
      this.dragHappening = false
    },
    handleDragOver: function (event) {
      event.preventDefault()
      this.dragHappening = true
    },
    handleDragLeave: function (event) {
      event.preventDefault()
      this.dragHappening = false
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
    },
    addSubProject: function () {
      this.closeMenu()
      if (this.isNonEmptyFolder) {
        this.addChild()
      } else {
        this.$set(this.project, 'children', [])
        this.addChild()
      }
      this.$store.commit('setExpanded', { what: this.project.id, state: true })
    },
    addChild: function () {
      const newChildProject = { name: 'new project', id: this.uuidv4() }
      this.project.children.push(newChildProject)
      this.$store.commit('setProjectName', newChildProject)
      this.updateProjects()
    },
    removeChild: function (uuid) {
      const filtered = this.project.children.filter(p => p.id !== uuid)
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
      this.closeMenu()
      // You can't edit special projects
      if (this.isSpecialProject()) {
        console.log('you cannot edit special project: ' + this.project.id)
        return
      }
      console.log('starting to edit: ' + this.project.name)
      this.projectNameBeforeEdit = this.project.name
      this.editing = true
    },
    closeMenu: function () {
      // close the tippy
      const tippyInstance = this.$refs.projectName._tippy
      tippyInstance.hide()
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
      this.selectProject()
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
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
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

    input {
        font: inherit;
    }

    .projectInput {
        width: 100px;
    }

    input:focus {
        outline-color: #4AD94A;
    }

    input::selection {
        background-color: #4AD94A;
    }

    .projectEdits {
      color: #4AD94A;
    }

    .iconProjectEdits {
      height: 10px;
      opacity: 0.7;
    }

    .hasContextMenu {
      cursor: context-menu;
    }

</style>

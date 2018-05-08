import Vue from 'vue'

<template>
    <li>

        <div>
            <span @click="toggle">
                <font-awesome-icon :icon="getFolderIcon"/>
            </span>
            <span @contextmenu.prevent="$refs.ctxMenu.open">{{ project.name }} {{project.id}}</span>
        </div>
        <ul v-show="open" v-if="isNonEmptyFolder">
            <Project
                    class="project"
                    v-for="(project, index) in project.children"
                    :key="index"
                    :project="project">
            </Project>
        </ul>
        <context-menu id="context-menu" ref="ctxMenu">
    <li @click="addSubProject">Add subproject</li>
    <li @click="$emit('remove', project.id)">Remove</li>
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
        open: false
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
      }
    },
    methods: {
      toggle: function () {
        if (this.isNonEmptyFolder) {
          this.open = !this.open
        }
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
      },
      // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
      uuidv4: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          let r = Math.random() * 16 | 0
          let v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }
    }
  }
</script>

<style scoped>

    .project {
        cursor: pointer;
    }

    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
    }

</style>
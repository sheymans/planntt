import Vue from 'vue'

<template>
    <li>

        <div>
            <span @click="toggle">
                <font-awesome-icon :icon="getFolderIcon"/>
            </span>
            <span @contextmenu.prevent="$refs.ctxMenu.open">{{ project.name }}</span>
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
          name: 'new stuff'
        })
      }
    }
  }
</script>

<style scoped>

    .project {
        cursor: pointer;
    }

    .bold {
        font-weight: bold;
    }

    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
    }

</style>
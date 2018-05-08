import Vue from 'vue'

<template>
    <li>

        <div :class="{bold: isFolder}"
             @click="toggle"
             @dblclick="changeType">
            <font-awesome-icon :icon="getFolderIcon" />
            {{ project.name }}
            <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
        </div>
        <ul v-show="open" v-if="isFolder">
            <Project
                    class="project"
                    v-for="(project, index) in project.children"
                    :key="index"
                    :project="project">
            </Project>
            <li class="add" @click="addChild">+</li>
        </ul>
    </li>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

  export default {
    name: 'Project',
    components: {FontAwesomeIcon},
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
      isFolder: function () {
        return this.project.children &&
          this.project.children.length
      },
      getFolderIcon: function () {
        if (this.open) {
          return 'folder-open'
        } else {
          return 'folder'
        }
      }
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      changeType: function () {
        if (!this.isFolder) {
          this.$set(this.project, 'children', [])
          this.addChild()
          this.open = true
        }
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
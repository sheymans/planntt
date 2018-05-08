import Vue from 'vue'

<template>
    <li>
        <div :class="{bold: isFolder}"
             @click="toggle"
             @dblclick="changeType">
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
  export default {
    name: 'Project',
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
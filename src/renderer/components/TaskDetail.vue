import Vue from 'vue'

<template>
    <nav class="panel">
        <p class="panel-heading">
            <span v-if="selectedTask.name">{{selectedTask.name}}</span>
            <span v-if="!selectedTask.name">no task selected</span>
        </p>
        <div class="panel-block">
            more details here.
        </div>
    </nav>
</template>

<script>
  export default {
    name: 'TaskDetail',
    components: {},
    data: function () {
      return {
        task: {}
      }
    },
    computed: {
      selectedTask: function () {
        return this.$store.getters.getSelectedTask
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
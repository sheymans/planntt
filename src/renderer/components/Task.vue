import Vue from 'vue'

<template>
    <li>{{ task.name }}</li>
</template>

<script>
  export default {
    name: 'Task',
    components: {},
    props: {
      task: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        editing: false
      }
    },
    methods: {
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

</style>
import Vue from 'vue'

<template>
    <a class="panel-block">
        <label class="checkbox">
            <input type="checkbox" v-model="task.completed" @change="toggleTaskCheckbox">{{ task.name }}
        </label>
    </a>
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
      toggleTaskCheckbox: function () {
        // save the task when checkbox toggled
        console.log('update task DB for task with id ' + this.task.id + ' to set completed state to ' + this.task.completed)
        this.$taskDb.update({id: this.task.id}, {$set: {completed: this.task.completed}}, {})
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

</style>
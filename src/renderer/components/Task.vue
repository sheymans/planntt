import Vue from 'vue'

<template>
    <li>
        <input type="checkbox" v-model="task.completed" @change="toggleTaskCheckbox">
        <span :class="{selected: isSelectedTask}" @click="selectTask" v-draggable="task" class="taskSummary">{{ task.name }}</span>
    </li>
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
    computed: {
      isSelectedTask: function () {
        let currentlySelected = this.$store.getters.getSelectedTask
        return (currentlySelected.id === this.task.id)
      }
    },
    methods: {
      toggleTaskCheckbox: function () {
        // save the task when checkbox toggled
        console.log('update task DB for task with id ' + this.task.id + ' to set completed state to ' + this.task.completed)
        this.$taskDb.update({id: this.task.id}, {$set: {completed: this.task.completed}}, {})
      },
      selectTask: function () {
        this.$store.commit('setSelectedTask', this.task)
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

    li {
        list-style: none;
    }

    .taskSummary:hover {
        background-color: chartreuse;
    }

    .selected {
        text-decoration: underline;
        color: forestgreen;
    }
</style>
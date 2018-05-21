import Vue from 'vue'

<template>
    <li class="taskItem">
        <input class="taskCheckbox" type="checkbox" v-model="task.completed" @change="toggleTaskCheckbox">
        <span class="projectLabel">{{ getProjectName }}</span>
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
      },
      getProjectName: function () {
        return this.$store.getters.getProjectName(this.task.project)
      }
    },
    filters: {
      shorten: function (n) {
        return n.toString().substring(0, 5)
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

    .taskItem {
        float:left;
        width: 100%;
    }

    .taskCheckbox {
        float:left;
        width: 2%;
    }

    .taskSummary:hover {
        background-color: chartreuse;
    }
    .taskSummary {
        float:left;
    }

    .selected {
        text-decoration: underline;
        color: forestgreen;
    }

    .projectLabel {
        float:left;
        width: 15%;
        color: darkslategrey;
        padding-left: 2px;
        padding-right: 2px;
        border-radius: 5%;
        font-family: 'Roboto Mono';
        font-style: normal;
        font-size: 8px;
        -webkit-font-smoothing: antialiased;
    }

</style>
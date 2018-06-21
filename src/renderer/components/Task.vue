import Vue from 'vue'

<template>
    <div class="taskItem">
        <div class="taskCheckbox">
            <input type="checkbox" v-model="task.completed" @change="toggleTaskCheckbox">
        </div>
        <div class="projectLabel">{{ getProjectName}}</div>
        <div :class="{selected: isSelectedTask}" @click="selectTask" v-draggable="task" @drag-start="onDragStart" @drag-end="onDragEnd" class="taskSummary">{{ task.name }}</div>
    </div>
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
        editing: false,
        isSelectedTask: false
      }
    },
    computed: {
      getProjectName: function () {
        return this.$store.getters.getProjectName(this.task.project)
      }
    },
    filters: {
      shorten: function (n) {
        let nString = n.toString()
        let l = nString.length
        if (l > 12) {
          let shortened = nString.substring(0, 12)
          return `${shortened}..`
        }
        return nString
      }
    },
    methods: {
      onDragStart: function (task) {
        console.log('drag start ' + JSON.stringify(task))
      },
      onDragEnd: function (task) {
        console.log('drag end ' + JSON.stringify(task))
      },
      toggleTaskCheckbox: function () {
        // save the task when checkbox toggled
        console.log('update task DB for task with id ' + this.task.id + ' to set completed state to ' + this.task.completed)
        this.$taskDb.update({id: this.task.id}, {$set: {completed: this.task.completed}}, {})
      },
      selectTask: function () {
        this.$emit('setSelectedTask', this.task)
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

    .taskItem {
        grid-area: taskItem;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 20px 100px 0.9fr;
        grid-template-areas: "taskCheckbox  projectLabel    taskSummary";
        align-items: baseline;
    }

    .taskCheckbox {
        grid-area: taskCheckbox;
    }

    .taskSummary:hover {
        background-color: chartreuse;
    }
    .taskSummary {
        grid-area: taskSummary;
    }

    .selected {
        text-decoration: underline;
        color: forestgreen;
    }

    .projectLabel {
        grid-area: projectLabel;
        color: darkslategrey;
        font-family: 'Roboto Mono';
        font-style: normal;
        font-size: 8px;
        -webkit-font-smoothing: antialiased;
    }

</style>
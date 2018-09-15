import Vue from 'vue'

<template>
    <div class="taskItem">
        <div class="taskCheckbox">
            <input type="checkbox" v-model="task.completed" @change="toggleTaskCheckbox">
        </div>
        <div class="projectLabel">{{ getProjectName}}</div>
        <div :class="{selected: isSelectedTask}" @click="selectTask" draggable="true" @dragstart="dragTask" @dragend="dragEndTask" class="taskSummary">
            <span v-if="task.due"  :class="{'is-late': isLate}">[ {{task.due | moment("YYYY-MM-DD")}} ]</span>
            {{ task.name }}</div>
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
        editing: false
      }
    },
    computed: {
      isSelectedTask: function () {
        let selectedTaskId = this.$store.getters.getSelectedTaskId
        return selectedTaskId === this.task.id
      },
      getProjectName: function () {
        return this.$store.getters.getProjectName(this.task.project)
      },
      isLate: function () {
        if (this.task.due) {
          let today = this.$moment()
          let due = this.$moment(this.task.due)
          let daysAgo = today.diff(due, 'days')
          return daysAgo > 0
        } else {
          return false
        }
      }
    },
    created () {
      // Set the selected task based on the stored selected task.
      let selectedTaskId = this.$store.getters.getSelectedTaskId
      if (selectedTaskId === this.task.id) {
        this.$emit('setSelectedTask', this.task)
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
      toggleTaskCheckbox: function () {
        // save the task when checkbox toggled
        console.log('update task DB for task with id ' + this.task.id + ' to set completed state to ' + this.task.completed)
        this.$taskDb.update({id: this.task.id}, {$set: {completed: this.task.completed}}, {})
      },
      selectTask: function () {
        this.$emit('setSelectedTask', this.task)
        this.$store.commit('setSelectedTaskId', this.task.id)
      },
      dragTask: function (event) {
        this.$store.commit('setProjectTargetTaskDrag', null)
        event.dataTransfer.setData('text', JSON.stringify(this.task))
      },
      dragEndTask: function (event) {
        let projectTarget = this.$store.getters.getProjectTargetTaskDrag
        if (projectTarget) {
          this.task.project = projectTarget.id
          this.task.projectName = projectTarget.name
        }
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

    .is-late {
        color: red
    }

</style>
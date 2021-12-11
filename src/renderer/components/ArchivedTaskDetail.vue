import Vue from 'vue'

<template>
    <div v-if="Object.keys(task).length !== 0" class="taskDetail">
        <div v-if="Object.keys(task).length !== 0" class="taskName">
                <b>{{ task.name }}</b>
        </div>

        <div class="taskNote" v-if="Object.keys(task).length !== 0">
                <div class="noteDisplay" v-html="markedNote"></div>
        </div>
        <div class="timers">#sessions: {{numberOfSessions}} | total time: {{prettyTotalTimeSpent}}</div>
    </div>
</template>

<script>
// Markdown transformer
const MarkdownRenderer = require('../markdown_renderer/markdown_renderer.js').default
const mark = new MarkdownRenderer()

export default {
  name: 'ArchivedTaskDetail',
  components: {},
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    markedNote: function () {
      if (this.task.note) {
        return mark.marked(this.task.note)
      }
    },
    numberOfSessions: function () {
      if (this.task.numberOfSessions) {
        return this.task.numberOfSessions
      } else {
        return 0
      }
    },
    prettyTotalTimeSpent: function () {
      let totalTimeSpent = 0
      if (this.task.totalTimeSpent) {
        totalTimeSpent = this.task.totalTimeSpent
      }
      const hours = Math.floor(totalTimeSpent / 3600)
      const minutes = Math.floor((totalTimeSpent - (hours * 3600)) / 60)
      const seconds = totalTimeSpent - (hours * 3600) - (minutes * 60)
      return hours + 'h:' + minutes + 'm:' + seconds + 's'
    }
  },
  methods: {
    averageTimePerSession: function () {
      if (this.numberOfSessions === 0) {
        return 0
      } else {
        return this.totalTimeSpent / this.numberOfSessions
      }
    }
  }
}
</script>

<style scoped>

    .taskDetail {
        grid-area: taskDetail;
        display: grid;
        grid-template-rows: 40px 1fr;
        grid-template-columns: 1fr;
        grid-template-areas:    "taskName"
        "taskNote"
        "timers";
        grid-row-gap: 10px;
        background-color: #E0E0E0;
        padding: 20px;
        margin-right: 50px;
    }

    .taskName {
        grid-area: taskName;
        display: grid;
        grid-auto-flow: column;
        overflow: auto;
    }

    .taskNote {
        grid-area: taskNote;
    }

    .noteDisplay {
        width: 80%;
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-weight: 500;
        font-size: 10pt;
        -webkit-font-smoothing: antialiased;
    }

    .timers {
        display: grid;
        grid-area: timers;
        font-size: 9pt;
        justify-content: center;
    }

</style>

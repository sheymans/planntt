import Vue from 'vue'

<template>
    <div class="taskItem">
        <div class="doneLabel">{{task.done | moment("YYYY-MM-DD hh:mma")}} </div>
        <div class="projectLabel">{{ task.projectName }}[{{ task.when }}]</div>
        <div class="taskSummary" @click="selectTask">{{ task.name }}</div>
    </div>
</template>

<script>
  export default {
    name: 'ArchivedTask',
    components: {},
    props: {
      task: {
        type: Object,
        required: true
      }
    },
    methods: {
      selectTask: function () {
        this.$emit('setSelectedTask', this.task)
      }
    }
  }
</script>

<style scoped>

    .taskItem {
        grid-area: taskItem;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 250px 150px 1fr;
        grid-template-areas: "doneLabel projectLabel taskSummary";
        align-items: baseline;
    }

    .taskSummary:hover {
        background-color: chartreuse;
    }

    .taskSummary {
        grid-area: taskSummary;
    }

    .projectLabel {
        grid-area: projectLabel;
        color: darkslategrey;
        font-family: 'Roboto Mono';
        font-style: normal;
        font-size: 8px;
        -webkit-font-smoothing: antialiased;
    }

    .doneLabel {
        grid-area: doneLabel;
        color: forestgreen;
        font-family: 'Roboto Mono';
        font-style: normal;
        -webkit-font-smoothing: antialiased;
    }

</style>
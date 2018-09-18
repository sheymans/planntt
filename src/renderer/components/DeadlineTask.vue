import Vue from 'vue'

<template>
    <div class="taskItem">
        <div class="dueLabel">{{task.due | moment("YYYY-MM-DD")}} </div>
        <div class="projectLabel">{{ task.projectName }}</div>
        <div class="taskSummary">{{ task.name }}</div>
    </div>
</template>

<script>
  export default {
    name: 'DeadlineTask',
    components: {},
    props: {
      task: {
        type: Object,
        required: true
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

    .taskItem {
        grid-area: taskItem;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 250px 150px 1fr;
        grid-template-areas: "dueLabel projectLabel taskSummary";
        align-items: baseline;
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

    .dueLabel {
        grid-area: dueLabel;
        color: forestgreen;
        font-family: 'Roboto Mono';
        font-style: normal;
        -webkit-font-smoothing: antialiased;
    }

</style>
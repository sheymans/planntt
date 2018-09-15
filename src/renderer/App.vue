<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'planntt'
  }
</script>

<style>
  /* CSS */

  .mx-datepicker {
    font: initial;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 500;
    font-size: 10pt;
    -webkit-font-smoothing: antialiased;
  }

  .mx-input {
    font: initial;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 500;
    font-size: 10pt;
    -webkit-font-smoothing: antialiased;
  }

  .mx-calendar {
    font: initial;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 500;
    font-size: 10pt;
    -webkit-font-smoothing: antialiased;
  }

  .mx-calendar-content .cell.actived {
    background-color: forestgreen;
  }

  .mx-calendar-content .cell:hover {
    background-color: chartreuse;
  }


</style>

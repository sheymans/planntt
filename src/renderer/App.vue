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

  #app .mx-datepicker {
    font: initial;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 500;
    font-size: 10pt;
    -webkit-font-smoothing: antialiased;
  }

  #app .mx-input {
    font: initial;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 500;
    font-size: 10pt;
    -webkit-font-smoothing: antialiased;
  }

  #app .mx-calendar {
    font: initial;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 500;
    font-size: 10pt;
    -webkit-font-smoothing: antialiased;
  }

  #app .mx-calendar-content .cell.actived {
    background-color: forestgreen;
  }

  #app .mx-calendar-content .cell:hover {
    background-color: chartreuse;
  }


</style>

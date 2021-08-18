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
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 500;
    font-size: 10pt;
    -webkit-font-smoothing: antialiased;
  }

  #app .mx-input {
    font: initial;
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 500;
    font-size: 10pt;
    -webkit-font-smoothing: antialiased;
  }

  #app .mx-calendar {
    font: initial;
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 500;
    font-size: 10pt;
    -webkit-font-smoothing: antialiased;
  }

  #app .mx-calendar-content .cell.actived {
    background-color: forestgreen;
  }

  #app .mx-calendar-content .cell:hover {
    background-color: #4AD94A;
  }

  #app pre {
    white-space: pre-wrap;
    border-top: 1px solid #CCC;
    border-bottom: 1px solid #CCC;
    padding: 5px 0 5px 20px;
    margin: 0 0 0 0;
    background: #FCFCFC;
    width: 40vw;
    overflow-x: auto;
  }

  #app blockquote {
    border-left: 2px solid forestgreen;
    padding-left: 10px;
  }

  .tippy-box[data-theme~='planntt'] {
    background-color: forestgreen;
    font-family: 'JetBrains Mono Light';
    font-size: 8pt;
  }

  .tippy-box[data-theme~='planntt'][data-placement^='top'] > .tippy-arrow::before {
    border-top-color: forestgreen;
  }
  .tippy-box[data-theme~='planntt'][data-placement^='bottom'] > .tippy-arrow::before {
    border-bottom-color: forestgreen;
  }
  .tippy-box[data-theme~='planntt'][data-placement^='left'] > .tippy-arrow::before {
    border-left-color: forestgreen;
  }
  .tippy-box[data-theme~='planntt'][data-placement^='right'] > .tippy-arrow::before {
    border-right-color: forestgreen;
  }

</style>

<template>
    <div id="mainPage">
        Hello {{person}}!
    </div>
</template>

<script>
  export default {
    name: 'MainPage',
    data () {
      return {
        person: 'stijn'
      }
    }
  }
</script>

<style scoped>

</style>
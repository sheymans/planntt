<template>
    <li>
        {{ project.name }} and its id {{project.id}}
    </li>
</template>

<script>
  export default {
    name: 'Project',
    props: {
      project: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>
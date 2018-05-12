import Vue from 'vue'

<template>
    <nav class="panel">
        <p class="panel-heading">
            task detail
        </p>
        <div v-if="task.name" class="panel-block">
             <span v-show="!editingTaskName">
                {{ task.name }} &nbsp;</span>
            <input v-show="editingTaskName"
                   type="text"
                   class="input is-rounded"
                   v-model="task.name"
                   @blur="doneEditTaskName"
                   @keyup.enter="doneEditTaskName"
                   @keyup.esc="cancelEditTaskName"
                   v-focus="editingTaskName"/>
            <font-awesome-icon v-show="!editingTaskName" pull="left" @click="startEditTaskName" icon="pencil-alt"/>
        </div>
        <div v-if="!task.name" class="panel-block">
            no task selected
        </div>
    </nav>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

  export default {
    name: 'TaskDetail',
    components: {FontAwesomeIcon},
    props: {
      task: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        editingTaskName: false
      }
    },
    methods: {
      startEditTaskName: function () {
        console.log('starting to edit task name: ' + this.task.name)
        this.taskNameBeforeEdit = this.task.name
        this.editingTaskName = true
      },
      doneEditTaskName: function () {
        if (!this.editingTaskName) {
          return
        }
        this.task.name = this.task.name.trim()
        if (!this.task.name) {
          this.cancelEditTaskName()
        }
        this.editingTaskName = false
        this.taskNameBeforeEdit = null
        this.$store.commit('setSelectedTask', this.task)
        // Also save this updated task in the task list
        this.$emit('updateTask', this.task)
      },
      cancelEditTaskName: function () {
        this.task.name = this.taskNameBeforeEdit
        this.taskNameBeforeEdit = null
        this.editingTaskName = false
      }
    },
    // https://vuejs.org/v2/guide/custom-directive.html
    directives: {
      focus: function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    }
  }
</script>

<style scoped>

</style>
import Vue from 'vue'

<template>
    <nav class="panel">
        <p class="panel-heading">
            task detail
        </p>
        <div v-if="!task.name" class="panel-block">
            no task selected
        </div>
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
        <div v-if="task.name" class="panel-block">
            <div class="dropdown" :class="{'is-active': isWhenDropdownActive}">
                <div class="dropdown-trigger">
                    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="setWhenDropdownActive">
                        <span v-if="task.when">{{task.when | prettyWhen}}</span>
                        <span v-if="!task.when">When</span>
                        <span class="icon is-small">
                            <font-awesome-icon icon="caret-down"/>
                        </span>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                        <a href="#" @click="setWhen('today')" class="dropdown-item">
                            Today
                        </a>
                        <a  @click="setWhen('thisweek')" class="dropdown-item">
                            This Week
                        </a>
                        <a  @click="setWhen('waitingfor')"  href="#" class="dropdown-item">
                            Waiting For
                        </a>
                        <a  @click="setWhen('someday')" href="#" class="dropdown-item">
                            Someday
                        </a>
                    </div>
                </div>
            </div>
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
        editingTaskName: false,
        isWhenDropdownActive: false
      }
    },
    filters: {
      prettyWhen: function (n) {
        if (n === 'today') {
          return 'Today'
        }
        if (n === 'thisweek') {
          return 'This Week'
        }
        if (n === 'waitingfor') {
          return 'Waiting For'
        }
        if (n === 'someday') {
          return 'Someday'
        }
      }
    },
    methods: {
      setWhenDropdownActive: function () {
        if (this.isWhenDropdownActive) {
          this.isWhenDropdownActive = false
        } else {
          this.isWhenDropdownActive = true
        }
      },
      setWhen: function (when) {
        console.log('setting task to when: ' + when)
        this.task.when = when
        this.isWhenDropdownActive = false
        this.saveTask(this.task)
      },
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
        this.saveTask(this.task)
      },
      cancelEditTaskName: function () {
        this.task.name = this.taskNameBeforeEdit
        this.taskNameBeforeEdit = null
        this.editingTaskName = false
      },
      saveTask: function (task) {
        this.$store.commit('setSelectedTask', this.task)
        // Also save this updated task in the task list
        this.$emit('updateTask', this.task)
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
<template>
    <div id="mainPage">
        <div class="header">
            <div></div>
            <font-awesome-icon v-tipster="'leave focus mode (ESC)'" icon="times" @click="goBack"/>
        </div>
        <div class="content">
            <div class="name">{{journalEntry.name }}</div>
            <div class="note" v-html="markedNote"></div>
        </div>
    </div>
</template>

<script>
import Planntt from '../App'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Markdown transformer
const MarkdownRenderer = require('../markdown_renderer/markdown_renderer.js').default
const mark = new MarkdownRenderer()

export default {
  name: 'FocusJournalEntry',
  components: {
    FontAwesomeIcon, Planntt
  },
  props: {
    journalEntry: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  mounted () {

  },
  created () {
    document.addEventListener('keydown', this.keyHandler)
  },
  destroyed () {
    document.removeEventListener('keydown', this.keyHandler)
  },
  methods: {
    keyHandler: function (event) {
      event.stopImmediatePropagation()
      console.log('executing event listener')
      if (event.key === 'Escape' || event.keyCode === 27) {
        this.goBack()
      }
    },
    goBack: function () {
      this.$router.push('/journal')
    }
  },
  computed: {
    markedNote: function () {
      if (this.journalEntry.note) {
        return mark.marked(this.journalEntry.note)
      }
    }
  }
}
</script>

<style scoped>

    #mainPage {
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-weight: 500;
        font-size: 10pt;
        -webkit-font-smoothing: antialiased;
    }

    .header {
        display: grid;
        grid-area: header;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr 10px;
        grid-template-areas: ". close";
        margin-right: 10px;
        margin-top: 10px;
    }

    .close {
        display: grid;
        color: gray;
    }

    .content {
        display: grid;
        grid-area: content;
        grid-template-rows: 84px 1fr;
        grid-template-columns: 1fr;
        grid-template-areas: "name"
        "note";
    }

    .name {
        display: grid;
        grid-area: name;
        margin-top: 10px;
        font-size: 11pt;
        font-weight: bold;
        justify-content: center;
    }

    .note {
        display: grid;
        grid-area: note;
        font-size: 11pt;
        justify-content: center;
    }

    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
        margin-bottom: 1em;
    }

    li {
        list-style: none;
    }

</style>

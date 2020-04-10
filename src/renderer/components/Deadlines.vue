<template>
    <div id="mainPage">
        <div class="header">
            <img class="logo" id="logo" src="~@/assets/planntt.png" alt="planntt">
            <router-link class="home" to="/">Projects</router-link>
            <router-link class="journal" to="/journal">Journal</router-link>
            <router-link class="deadlines" to="/deadlines">Deadlines</router-link>
            <router-link class="archive" to="/archive">Archive</router-link>
            <router-link class="stats" to="/stats">Stats</router-link>
        </div>
        <div class="content">
            <DeadlineList/>
        </div>
    </div>
</template>

<script>
  import Planntt from '../App'
  import DeadlineList from './DeadlineList.vue'

  export default {
    name: 'Deadlines',
    components: {
      Planntt,
      DeadlineList
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
        grid-template-columns: 1fr 70px 80px 64px 64px 70px;
        grid-template-areas: "logo home deadlines journal archive stats";
    }

    .logo {
        grid-area: logo
    }

    .home {
        grid-area: home;
        text-decoration: underline;
        color: black;
    }

    .archive {
        grid-area: archive;
        text-decoration: underline;
        color: black;
    }


    .deadlines {
        grid-area: deadlines;
        text-decoration: underline;
        color: forestgreen;
    }


    .journal {
        grid-area: journal;
        text-decoration: underline;
        color: black;
    }

    .stats {
        grid-area: stats;
        text-decoration: underline;
        color: black;
    }

    .content {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 200px 1fr;
        grid-template-areas: ".   deadlineList";
    }

    #logo {
        width: 80px;
        height: auto;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-top: 10px;
    }

</style>

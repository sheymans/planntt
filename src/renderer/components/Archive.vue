<template>
    <div id="mainPage">
        <div class="header">
            <img class="logo" id="logo" src="~@/assets/planntt.png" alt="planntt">
            <router-link class="home" to="/">Projects</router-link>
            <router-link class="archive" to="/archive">Archive</router-link>
        </div>
        <div class="content">
            <ArchiveList/>
        </div>
    </div>
</template>

<script>
  import Planntt from '../App'
  import ArchiveList from './ArchiveList.vue'

  export default {
    name: 'Archive',
    components: {
      Planntt,
      ArchiveList
    }
  }
</script>

<style scoped>

    #mainPage {
        font-family: 'Raleway';
        font-style: normal;
        font-weight: 500;
        font-size: 10pt;
        -webkit-font-smoothing: antialiased;
    }

    .header {
        display: grid;
        grid-area: header;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr 60px 60px;
        grid-template-areas: "logo home archive";
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
        color: forestgreen;
    }

    .content {
        display: grid;
    }

    #logo {
        width: 80px;
        height: auto;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-top: 10px;
    }

</style>
<template>
  <div class="panel">
    <h1 class="publication-name">Publication Name</h1>
    <p class="publication-authors">Mario Luigi Waluigi</p>
    <p class="publication-date">01-01-2017</p>
    <p class="publication-rank">200</p>
    <h3 class="publication-abstract">Abstract</h3>
    <p class="publication-abstract-content">Lorem ipsum dolor sit amet,
      consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
      et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <button class="publication-link">Link to Publication</button>
    <div class="publication-actions">
      <button>Favorite</button>
      <button>Hide</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: 'Panel',
  data () {
    return {
    }
  },
  methods: {
    currentDate () {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }

      today = yyyy + "-" + mm + "-" + dd;
      return today;
    },
    logout () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>

<style scoped>
.panel {
  width: 380px;
  height: 100%;
  background-color: #404040;
  display: block;
  text-align: left;
  padding: 0 20px;
  color: #e6e6e6;
}

button {
  color: #404040;
  font-weight: 900;
  border: none;
  font-size: 30px;
}

.publication-link {
  margin-top: 10px;
  display: flex;
  width: 100%;
  justify-content: center;
}

.publication-actions {
  position: absolute;
  bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: inherit;
}

.publication-actions > button {
  width: 150px;
}
</style>

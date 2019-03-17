<template>
  <header class="toolbar">
      <div class="logo">
        <img class="logo-image" src="../assets/logo.png" width="300px">
        Visual Research
      </div>
      <div class="filters">
        <div class="search-container">
          PMID:
          <input class="search-input">
        </div>
        <div class="search-container">
          Start Date:
          <input type="date" value="1990-01-01">
        </div>
        <div class="search-container">
          End Date:
          <input type="date" :value="currentDate()">
        </div>
        <div class="search-container">
          Minimum Cited:
          <input type="number" class="min-cited-input" value="10">
        </div>
      </div>
      <div class="panel-actions">
        <button class="square-btn">
          <font-awesome-icon icon="check-square"/>
        </button>
        <button class="square-btn">
          <font-awesome-icon icon="minus-square"/>
        </button>
        <button class="square-btn" @click="logout">
          <font-awesome-icon icon="sign-out-alt"/>
        </button>
      </div>
    </header>
</template>

<script>
import firebase from "firebase";

export default {
  name: 'Toolbar',
  data () {
    return {
    }
  },
  methods: {
    currentDate() {
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
.toolbar {
  height: 60px;
  width: 100%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #404040;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}

.logo {
  display: flex;
  flex-direction: row;
  height: 30px;
  align-items: center;
  padding: 0 10px;
  background-color: #404040;
  height: 100%;
  color: #e6e6e6;
  font-weight: 600;
}

.logo-image {
  width: 30px;
  filter: invert(91%) sepia(8%) saturate(2724%) hue-rotate(319deg)
    brightness(97%) contrast(98%);
  margin-right: 5px;
}

.filters {
  display: flex;
  flex-direction: row;
  flex: 1;
  margin: 0 10px;
}

.filters > div {
  margin: 0 10px;
}

input {
  align-self: center;
  margin: 10px 0;
  padding: 7px;
  background-color: transparent;
  border: 1px solid #e6e6e6;
  color: #404040;
  font-weight: 600;
}

.square-btn {
  color: #404040;
  font-weight: 900;
  border: none;
  font-size: 30px;
}
</style>

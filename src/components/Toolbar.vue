<template>
  <header class="toolbar">
    <div class="logo">
      <img class="logo-image"
           src="../assets/logo.png"
           width="300px">
      Visual Research
    </div>
    <div class="filters">
      <div class="search-container">
        PMID:
        <input v-model="search"
               class="search-input">
      </div>
      <div class="search-container">
        Start Date:
        <input v-model="startDate"
               type="date">
      </div>
      <div class="search-container">
        End Date:
        <input v-model="endDate"
               type="date">
      </div>
      <div class="search-container">
        Minimum Cited:
        <input v-model="rank"
               type="number"
               class="min-cited-input">
      </div>
      <div class="search-container">
        <button class="submit-btn"
                @click="onUpdateQuery">
          SUBMIT
        </button>
      </div>

    </div>
    <div class="panel-actions">
      <button class="square-btn">
        <font-awesome-icon icon="check-square" />
      </button>
      <button class="square-btn">
        <font-awesome-icon icon="minus-square" />
      </button>
      <button class="square-btn"
              @click="logout">
        <font-awesome-icon icon="sign-out-alt" />
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
      updateTimeout: null,
      search: 'Memory Dysfunction',
      startDate: "2010-01-01",
      endDate: this.currentDate(),
      rank: 2
    }
  },
  methods: {
    onUpdateQuery () {
      this.$emit('updateQuery', this.query);
    },
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
  },
  computed: {
    query () {
      return {
        search: this.search,
        startDate: this.startDate,
        endDate: this.endDate,
        rank: this.rank
      }
    },
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
  align-items: center;
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

.submit-btn {
  color: #404040;
  font-weight: 900;
  border: none;
  font-size: 20px;
}
</style>

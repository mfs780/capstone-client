<template>
  <div class="panel"
       :class="{ 'closed': isClosed }">
    <div class="close"
         @click="toggleClose">
      <font-awesome-icon :icon="closeIcon" />
    </div>
    <div class="panel-content">
      <h1>Search</h1>
      <div class="filters">
        <div class="search-container">
          Title:
          <input v-model="search"
                 class="search-input">
        </div>
        <div class="search-container">
          Keywords:
          <input v-model="keywords"
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
          <button :disabled="isQuerying"
                  class="submit-btn"
                  @click="onUpdateQuery">
            <font-awesome-icon v-if="isQuerying"
                               class="spinner"
                               icon="spinner" />
            <span v-else>SUBMIT</span>
          </button>
        </div>
      </div>
    </div>
    <div class="search-content"
         @click="clickSearch">
      <div v-for="(value, key) in searches"
           class="search-item"
           :class="{ 'selected': isSelected(key) }"
           :key="key">
        <div class="search-color"
             :style="{ backgroundColor: value }" />
        {{key}}
        <div class="search-close">
          <font-awesome-icon icon="times-circle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import firebase from "firebase";

export default {
  name: 'Search',
  data () {
    return {
      isClosed: false,
      updateTimeout: null,
      keywords: '',
      search: 'Memory Dysfunction',
      startDate: "2010-01-01",
      endDate: this.currentDate(),
      rank: 2
    };
  },
  methods: {
    ...mapActions([
      'selectSearch',
      'removeSearch'
    ]),
    isSelected (searchTerm) {
      return searchTerm === this.selectedSearch
    },
    clickSearch (e) {
      let $close = e.target.closest('.search-close');
      let $searchItem = e.target.closest('.search-item');
      if($close) {
        this.removeSearch($searchItem.innerText);
      } else if ($searchItem) {
        this.selectSearch($searchItem.innerText);
      }
    },
    toggleClose () {
      this.isClosed = !this.isClosed;
    },
    onUpdateQuery () {
      if (this.query.search.length < 3) {
        return;
      }
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
  },
  computed: {
    ...mapState([
      'isQuerying',
      'searches',
      'selectedSearch'
    ]),
    query () {
      return {
        search: this.search,
        startDate: this.startDate,
        endDate: this.endDate,
        rank: this.rank
      }
    },
    closeIcon () {
      return this.isClosed ? 'plus-square' : 'minus-square';
    }
  },
};
</script>

<style scoped>
.closed {
  transform: translateX(-370px);
}

.panel {
  position: absolute;
  width: 370px;
  height: 100%;
  background-color: #404040;
  display: block;
  text-align: left;
  padding: 0 30px 0 0px;
  color: #e6e6e6;
  overflow: auto;
  transition-duration: 500ms;
}

.panel-content {
  position: relative;
  overflow-y: auto;
  top: 0;
  margin-bottom: 115px;
}

h1 {
  text-align: center;
  text-transform: uppercase;
}

.filters {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 10px;
  align-items: flex-start;
}

.filters > div {
  margin: 0 10px;
}

.search-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

input {
  align-self: center;
  margin: 10px 0;
  padding: 7px;
  background-color: transparent;
  border: 1px solid #e6e6e6;
  color: #e6e6e6;
  font-weight: 600;
  max-width: -webkit-fill-available;
  width: 50%;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
  text-align: center;
  outline: none;
  color: #404040;
  font-weight: 900;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.spinner {
  animation: fa-spin 2s infinite linear;
}

.close {
  position: absolute;
  right: 0;
  font-size: 20px;
  padding: 0 5px;
}

.search-item {
  height: 15px;
  border-radius: 50%;
  color: #e6e6e6;
  margin: 2px;
  margin-bottom: 10px;
  opacity: 0.6;
  position: relative;
}

.selected {
  text-shadow: 1px 1px 1px #000;
  opacity: 1;
}

.search-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.search-close {
  display: inline-block;
  position: absolute;
  right: 1px;
}
</style>
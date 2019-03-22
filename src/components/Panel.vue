<template>
  <div class="panel">
    <div v-if="metadata.title">
      <h1 v-if="metadata.title"
          class="publication-name">{{metadata.title}}</h1>
      <p v-if="metadata.authors"
         class="publication-authors">
        Authors:
        <span v-for="(author, index) in metadata.authors"
              :key="index">{{author.name}}</span>
      </p>
      <p v-if="metadata.pubyear"
         class="publication-date">Pub Date: {{metadata.pubyear}}</p>
      <p v-if="metadata.rank"
         class="publication-rank">Page Rank: 200</p>
      <h3 v-if="metadata.abstract"
          class="publication-abstract">Abstract</h3>
      <p v-if="metadata.abstract"
         class="publication-abstract-content">{{metadata.abstract}}</p>
      <button v-if="metadata.id"
              class="publication-link"
              @click="onClickLinktoPub">Link to Publication</button>
      <div class="publication-actions">
        <button>Favorite</button>
        <button>Hide</button>
      </div>
    </div>
    <div v-else
         class="no-data">
      <h2>{{metadata.msg || msg}}</h2>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: 'Panel',
  props: ['metadata'],
  data () {
    return {
      msg: "Click on a Node to see its Metadata"
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
    onClickLinktoPub () {
      console.log("https://www.ncbi.nlm.nih.gov/pubmed/?term=" + this.metadata.id);
      window.open("https://www.ncbi.nlm.nih.gov/pubmed/?term=" + this.metadata.id);
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
  overflow: auto;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
}

button {
  color: #404040;
  font-weight: 900;
  border: none;
  font-size: 30px;
}

.publication-authors > span::after {
  content: ", ";
}

.publication-authors > span:last-child:after {
  content: "";
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
  width: 400px;
}

.publication-actions > button {
  width: 150px;
}
</style>

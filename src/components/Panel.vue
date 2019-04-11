<template>
  <div class="panel">
    <div v-if="metadata.title" class="panel-content">
      <h1 v-if="metadata.title" class="name">{{metadata.title}}</h1>
      <p v-if="metadata.authors" class="authors">
        Authors:
        <span v-for="(author, index) in metadata.authors" :key="index">{{author.name}}</span>
      </p>
      <p v-if="metadata.pubyear" class="date">Pub Date: {{metadata.pubyear}}</p>
      <p v-if="metadata.rank" class="rank">Page Rank: 200</p>
      <h3 v-if="metadata.abstract" class="abstract">Abstract</h3>
      <p v-if="metadata.abstract" class="abstract-content">{{metadata.abstract}}</p>
    </div>
    <div v-else class="no-data">
      <h2>{{metadata.msg || msg}}</h2>
    </div>
    <div v-if="metadata.title" class="actions">
      <button v-if="metadata.id" class="action long" @click="onClickLinktoPub">Link to Publication</button>
      <button @click="onClickFavorite" class="action">{{favoriteText}}</button>
      <button class="action">Hide</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Panel",
  props: {
    metadata: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      msg: "Click on a Node to see its Metadata",
      favoriteText: ""
    };
  },
  mounted() {
    this.setFavoriteText();
  },
  methods: {
    setFavoriteText() {
      this.favoriteText = this.metadata.isFavorite ? "Unfavorite" : "Favorite";
    },
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
    onClickLinktoPub() {
      console.log(
        "https://www.ncbi.nlm.nih.gov/pubmed/?term=" + this.metadata.id
      );
      window.open(
        "https://www.ncbi.nlm.nih.gov/pubmed/?term=" + this.metadata.id
      );
    },
    onClickFavorite() {
      this.metadata.isFavorite = !this.metadata.isFavorite;
      this.setFavoriteText();
      this.$emit("update-favorite", this.metadata);
    }
  }
};
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

.panel-content {
  position: relative;
  overflow-y: auto;
  top: 0;
  margin-bottom: 115px;
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
  font-size: 25px;
}

.authors > span::after {
  content: ", ";
}

.authors > span:last-child:after {
  content: "";
}

.actions {
  background-color: #404040;
  position: absolute;
  bottom: 0;
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 380px;
  flex-wrap: wrap;
}

.action.long {
  margin-bottom: 10px;
  display: flex;
  width: 340px;
  justify-content: center;
}

.action {
  width: 150px;
}
</style>

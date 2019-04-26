<template>
  <div class="panel">
    <div v-if="nodeMetaData.title" class="panel-content">
      <h1 v-if="nodeMetaData.title" class="name">{{nodeMetaData.title}}</h1>
      <p v-if="nodeMetaData.authors" class="authors">
        Authors:
        <span v-for="(author, index) in nodeMetaData.authors" :key="index">{{author.name}}</span>
      </p>
      <p v-if="nodeMetaData.pubyear" class="date">Pub Date: {{nodeMetaData.pubyear}}</p>
      <p v-if="nodeMetaData.jid" class="rank">Page Rank: {{nodeMetaData.jid}}</p>
      <h3 v-if="nodeMetaData.abstract" class="abstract">Abstract</h3>
      <p v-if="nodeMetaData.abstract" class="abstract-content">{{nodeMetaData.abstract}}</p>
    </div>
    <div v-else class="no-data">
      <h2>{{nodeMetaData.msg || msg}}</h2>
    </div>
    <div v-if="nodeMetaData.title" class="actions">
      <button v-if="nodeMetaData.id" class="action long" @click="onClickLinktoPub">Link to Publication</button>
      <button @click="onClickFavorite" class="action long">{{favoriteText}}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import firebase from "firebase";

export default {
  name: "Panel",
  data() {
    return {
      msg: "Click on a Node to see its MetaData",
      favoriteText: ''
    };
  },
  mounted () {
    this.setFavoriteText();
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
    onClickLinktoPub() {
      window.open(
        "https://www.ncbi.nlm.nih.gov/pubmed/?term=" + this.nodeMetaData.id
      );
    },
    onClickFavorite() {
      this.$emit("update-favorite", this.getNodeById(this.selectedNode));
      this.setFavoriteText();
    },
    setFavoriteText () {
      let node = this.getNodeById(this.selectedNode);
      this.favoriteText = node && node.isFavorite ? "Unfavorite" : "Favorite";
    }
  },
  computed: {
    ...mapState([
      'selectedNode',
      'nodeMetaData',
    ]),
    ...mapGetters([
      'getNodeById'
    ]),
    sNode () {
      return this.getNodeById(this.selectedNode);
    }
  },
  watch: {
    sNode () {
      this.setFavoriteText();
    }
  },
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

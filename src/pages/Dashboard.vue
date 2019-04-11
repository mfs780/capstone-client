<template>
  <div class="dashboard">
    <toolbar @updateQuery="onQueryChange"/>
    <div class="content">
      <div class="visualization">
        <div class="legend">
          <div class="legend-item" v-for="(value, key) in searches" :key="key">
            <div class="legend-color" :style="{ backgroundColor: value }"></div>
            {{key}}
          </div>
        </div>
        <force-graph :netgraph="graph" @node-click="onNodeClick"/>
      </div>
      <panel @update-favorite="onUpdateFavorite"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import axios from "axios";
import ForceGraph from "../components/ForceGraph.vue";
import Panel from "../components/Panel.vue";
import Toolbar from "../components/Toolbar.vue";
import firebase from "firebase";
import { db } from "../main";

export default {
  name: "Dashboard",
  components: {
    ForceGraph,
    Panel,
    Toolbar
  },
  data() {
    return {
    };
  },
  mounted() {
    console.log(db);
  },
  methods: {
    ...mapActions([
      'visitNode',
      'favoriteNode',
      'queryMetaData',
      'queryNodes',
      'selectNode'
    ]),
    onQueryChange(query) {
      let newQuery = {
        title: query.search,
        min_year: parseInt(query.startDate.split("-")[0]),
        max_year: parseInt(query.endDate.split("-")[0]),
        min_cite: parseInt(query.rank),
        rank: "citations"
      };
      this.queryNodes(newQuery);
    },
    onNodeClick(node) {
      this.selectNode(node);
      this.visitNode(node);
      this.queryMetaData(node.id);
    },
    onUpdateFavorite(node) {
      this.favoriteNode(node);
    }
  },
  computed: {
    ...mapState([
      'searches',
    ]),
    ...mapGetters([
      'graph'
    ])
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 0;
  top: 61px;
  width: 100%;
}

.visualization {
  display: flex;
  flex: 1;
  height: 100%;
  overflow: none;
  background-color: #e6e6e6;
}

.legend {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
  width: fit-content;
  height: fit-content;
  overflow-y: auto;
  font-size: 11px;
  text-align: left;
  max-height: 150px;
  display: block;
}

.legend-item {
  height: 15px;
  border-radius: 50%;
  color: black;
  margin: 2px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

[tooltip]:before {
  position: fixed;
  bottom: 20px;
  left: 10px;
  content: attr(tooltip);
  opacity: 0;
  width: 100%;
  text-align: left;
}

[tooltip]:hover:before {
  opacity: 1;
}
</style>
<style>
.net {
  width: 100%;
  height: 100%;
}

svg {
  height: 99%;
  width: 99%;
}

path {
  stroke: brown;
}
</style>

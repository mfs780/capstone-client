<template>
  <div class="dashboard">
    <toolbar />
    <div class="content">
      <search @updateQuery="onQueryChange" />
      <div class="visualization">
        <force-graph :netgraph="graph"
                     @node-click="onNodeClick" />
      </div>
      <panel @update-favorite="onUpdateFavorite" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import axios from "axios";
import ForceGraph from "../components/ForceGraph.vue";
import Panel from "../components/Panel.vue";
import Search from "../components/Search.vue";
import Toolbar from "../components/Toolbar.vue";
import firebase from "firebase";
import { db } from "../main";

export default {
  name: "Dashboard",
  components: {
    ForceGraph,
    Panel,
    Search,
    Toolbar
  },
  data () {
    return {
    };
  },
  mounted () {
    db.collection("dashboards").doc(firebase.auth().currentUser.email).get().then((res) => {
      this.initState(res.data());
    });
  },
  methods: {
    ...mapActions([
      'initState',
      'visitNode',
      'favoriteNode',
      'queryMetaData',
      'queryNodes',
      'selectNode'
    ]),
    onQueryChange (query) {
      let newQuery = {
        title: query.search,
        keywords: query.keywords,
        min_year: parseInt(query.startDate.split("-")[0]),
        max_year: parseInt(query.endDate.split("-")[0]),
        min_cite: parseInt(query.rank),
        rank: "citations"
      };
      this.queryNodes(newQuery);
    },
    onNodeClick (node) {
      this.selectNode(node);
      this.visitNode(node);
      this.queryMetaData(node.id);
    },
    onUpdateFavorite (node) {
      this.favoriteNode(node);
    }
  },
  computed: {
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

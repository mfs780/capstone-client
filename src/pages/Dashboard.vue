<template>
  <div class="dashboard">
    <toolbar @updateQuery="onQueryChange"/>
    <div class="content">
      <div class="visualization">
        <div class="legend">
          <div class="legend-item purple" tooltip="New"></div>
          <div class="legend-item brown" tooltip="Not Visited"></div>
          <div class="legend-item yellow" tooltip="Visited"></div>
        </div>
        <force-graph :netgraph="graph" @node-click="clicky"/>
        <!-- <d3-network :net-nodes="nodes"
                    :net-links="links"
                    :options="options"
        @node-click="clicky"></d3-network>-->
      </div>
      <panel :metadata="panelData"/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ForceGraph from "../components/ForceGraph.vue";
import Panel from "../components/Panel.vue";
import Toolbar from "../components/Toolbar.vue";
import D3Network from "vue-d3-network";
import firebase from "firebase";
import { db } from "../main";

export default {
  name: "Dashboard",
  components: {
    ForceGraph,
    D3Network,
    Panel,
    Toolbar
  },
  data() {
    return {
      clickyTimeout: null,
      panelData: {},
      nodeMap: {},
      nodes: [],
      links: [],
      options: {
        force: 800,
        nodeSize: 20,
        nodeLabels: false,
        linkWidth: 1
      }
    };
  },
  mounted() {},
  methods: {
    onQueryChange(query) {
      let newQuery = {
        title: query.search,
        min_year: parseInt(query.startDate.split("-")[0]),
        max_year: parseInt(query.endDate.split("-")[0]),
        min_cite: parseInt(query.rank),
        rank: "citations"
      };
      console.log(newQuery);
      this.queryNode(newQuery);
    },
    clicky(node) {
      if (this.clickyTimeout != null) {
        clearTimeout(this.clickyTimeout);
        this.clickyTimeout = null;
        this.expandNode(node);
        this.getNodeData(node);
      } else {
        this.clickyTimeout = setTimeout(() => {
          this.getNodeData(node);
          clearTimeout(this.clickyTimeout);
          this.clickyTimeout = null;
        }, 500);
      }
    },
    getNodeData(node) {
      node._color = "yellow";
      this.nodes = [...this.nodes];
      let id = node.id;
      this.queryMetaData(id);
    },
    expandNode(node) {
      let id = node.id;
      if (node._color !== "red") {
        this.queryNode(id);
      }
      node._color = "red";
    },
    queryMetaData(id) {
      axios
        .get("https://rv-harvard-api-stage.herokuapp.com/article/" + id)
        .then(this.parseMetaData)
        .catch(() => {
          this.panelData = {
            msg: "No Metadata Available"
          };
        });
    },
    queryNode(query) {
      axios
        .post("https://rv-harvard-api-stage.herokuapp.com/graph/title", query)
        .then(this.addNodes)
        .catch(console.error);
    },
    parseMetaData(res) {
      this.panelData = res.data.article[0];
    },
    addNodes(res) {
      let links = res.data.graph.links;
      let nodes = res.data.graph.nodes;

      this.links = links;
      this.nodes = nodes;
    }
  },
  computed: {
    graph() {
      return {
        nodes: this.nodes,
        links: this.links
      };
    }
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
  width: 100px;
  height: 20px;
  background-color: darkgray;
  opacity: 0.9;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.legend-item {
  height: 10px;
  width: 10px;
  border-radius: 50%;
}

.legend-item.yellow {
  background-color: yellow;
}

.legend-item.brown {
  background-color: #404040;
}

.legend-item.purple {
  background-color: purple;
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

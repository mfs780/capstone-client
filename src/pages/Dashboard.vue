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
      <panel :metadata="panelData" @update-favorite="onUpdateFavorite"/>
    </div>
  </div>
</template>

<script>
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
      searches: {},
      panelData: {},
      nodes: [],
      links: []
    };
  },
  mounted() {
    console.log(db);
  },
  methods: {
    onQueryChange(query) {
      let newQuery = {
        title: query.search,
        min_year: parseInt(query.startDate.split("-")[0]),
        max_year: parseInt(query.endDate.split("-")[0]),
        min_cite: parseInt(query.rank),
        rank: "citations"
      };
      this.queryNode(newQuery);
    },
    onNodeClick(node) {
      node.isVisted = true;
      this.nodes = [...this.nodes];
      let id = node.id;
      this.queryMetaData(id);
    },
    onUpdateFavorite(data) {
      let node = this.getNodeById(data.id);
      node.isFavorite = data.isFavorite;
      console.log(node.isFavorite);
      this.nodes = [...this.nodes];
    },
    queryMetaData(id) {
      axios
        .get("https://rv-harvard-api-stage.herokuapp.com/article/" + id)
        .then(this.setPanelData)
        .catch(() => {
          this.panelData = {
            msg: "No Metadata Available"
          };
        });
    },
    queryNode(query) {
      axios
        .post("https://rv-harvard-api-stage.herokuapp.com/graph/title", query)
        .then(res => {
          this.setNodes(res, query);
        })
        .catch(console.error);
    },
    setPanelData(res) {
      let panelData = res.data.article[0];
      let nodeData = this.getNodeById(panelData.id) || {};
      this.panelData = Object.assign(panelData, nodeData);
    },
    setNodes(res, query) {
      let newNodes = this.setNodeBorderColorByQuery(
        res.data.graph.nodes,
        query
      );
      this.nodes = this.mergeByKeys(["id"], this.nodes, newNodes);
      this.links = this.mergeByKeys(
        ["source", "target"],
        this.links,
        res.data.graph.links
      );
    },
    setNodeBorderColorByQuery(nodes, query) {
      this.searches[query.title] =
        this.searches[query.title] || this.randomColor();
      nodes.forEach(node => {
        if (node.search_returned_paper) {
          node._border = this.searches[query.title];
        }
      });

      return nodes;
    },
    mergeByKeys(keys, source, target) {
      let src = Object.assign([], source);
      let trt = Object.assign([], target);
      trt.forEach(tE => {
        let isMatch = false;
        src.some((sE, index) => {
          isMatch = keys.every(key => {
            return tE[key] == sE[key];
          });
          if (isMatch) {
            src[index] = Object.assign(src[index], tE);
            return true;
          }
          return false;
        });

        if (!isMatch) {
          src.push(tE);
        }
      });

      return src;
    },
    getNodeById(id) {
      return this.nodes.find(node => {
        return node.id === id;
      });
    }
  },
  computed: {
    graph() {
      return {
        nodes: this.nodes,
        links: this.links
      };
    },
    randomColor() {
      return (() => {
        var golden_ratio_conjugate = 0.618033988749895;
        var h = Math.random();

        var hslToRgb = function(h, s, l) {
          var r, g, b;

          if (s == 0) {
            r = g = b = l; // achromatic
          } else {
            function hue2rgb(p, q, t) {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
          }

          return (
            "#" +
            Math.round(r * 255).toString(16) +
            Math.round(g * 255).toString(16) +
            Math.round(b * 255).toString(16)
          );
        };

        return function() {
          h += golden_ratio_conjugate;
          h %= 1;
          return hslToRgb(h, 0.5, 0.6);
        };
      })();
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

<template>
  <div class="dashboard">
    <toolbar/>
    <div class="content">
      <div class="visualization">
        <d3-network :net-nodes="nodes" :net-links="links" :options="options" @node-click="clicky"></d3-network>
      </div>
      <panel :metadata="panelData"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Panel from "../components/Panel.vue";
import Toolbar from "../components/Toolbar.vue";
import D3Network from "vue-d3-network";
import firebase from "firebase";
import { db } from "../main";

export default {
  name: "Dashboard",
  components: {
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
  mounted() {
    this.queryNode("4423606");
  },
  methods: {
    clicky(e, node) {
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
      let id = node.name.split(" ")[1];
      this.queryMetaData(id);
    },
    expandNode(node) {
      let id = node.name.split(" ")[1];

      if (node._color !== "red") {
        this.queryNode(id);
      }
      node._color = "red";
    },
    queryMetaData(id) {
      axios.get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&id=" +
          id +
          "&retmode=json",
      ).then(this.parseMetaData)
      .catch(console.error);
    },
    queryNode(id) {
      axios.get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pmc&linkname=pmc_refs_pubmed&id=" +
          id +
          "&retmode=json"
      ).then(this.addNodes)
      .catch(console.error);
    },
    addNodes(res) {
      let rootLink = res.data.linksets[0].ids[0];
      let links = res.data.linksets[0].linksetdbs[0].links;

      if (!this.nodeMap[rootLink]) {
        this.nodeMap[rootLink] = true;
        this.nodes.push({ id: rootLink });
      }

      links.forEach(link => {
        if (!this.nodeMap[link]) {
          this.nodeMap[link] = true;
          let new_node = { id: link };
          if (new_node.id == 212572) {
            new_node._color = "orange";
          }
          this.nodes.push(new_node);
        }
      });

      this.links.push(
        ...links.map(link => {
          return { sid: rootLink, tid: link };
        })
      );
    },
    getRequest(url, success, error) {
      var req = false;
      try {
        req = new XMLHttpRequest();
      } catch (e) {
        try {
          req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          try {
            req = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) {
            return false;
          }
        }
      }
      if (!req) return false;
      if (typeof success != "function") success = function() {};
      if (typeof error != "function") error = function() {};
      req.onreadystatechange = function() {
        if (req.readyState == 4) {
          return req.status === 200
            ? success(req.responseText)
            : error(req.status);
        }
      };
      req.open("GET", url, true);
      req.send(null);
      return req;
    },
    parseMetaData(res) {
      this.panelData = res.data.result[res.data.result.uids[0]];
      console.log(this.panelData);
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

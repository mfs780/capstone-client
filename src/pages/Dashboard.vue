<template>
  <div class="dashboard">
    <toolbar/>
    <div class="content">
      <div class="visualization">
        <d3-network :net-nodes="nodes" :net-links="links" :options="options" @node-click="clicky"></d3-network>
      </div>
      <panel/>
    </div>
  </div>
</template>

<script>
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
      console.log(node);
      let id = node.name.split(" ")[1];
      console.log(id);

      if (node._color !== "red") {
        this.queryNode(id);
      }
      node._color = "red";
    },
    queryNode(id) {
      this.getRequest(
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?		dbfrom=pmc&linkname=pmc_refs_pubmed&id=" +
          id +
          "&tool=my_tool&email=my_email@example.com", // demo-only URL
        this.addNodes,
        console.log
      );
    },
    addNodes(xml) {
      let x2js = new X2JS();
      let data = x2js.xml_str2json(xml);
      console.log(data);
      let rootLink = data.eLinkResult.LinkSet.IdList;
      let links = data.eLinkResult.LinkSet.LinkSetDb.Link;

      if (!this.nodeMap[rootLink.Id]) {
        this.nodeMap[rootLink.Id] = true;
        this.nodes.push({ id: rootLink.Id });
      }

      links.forEach(link => {
        if (!this.nodeMap[link.Id]) {
          this.nodeMap[link.Id] = true;
          let new_node = { id: link.Id };
          if (new_node.id == 212572) {
            new_node._color = "orange";
          }
          this.nodes.push(new_node);
        }
      });

      this.links.push(
        ...links.map(link => {
          return { sid: rootLink.Id, tid: link.Id };
        })
      );
      console.log(this.nodes);
      console.log(this.links);
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

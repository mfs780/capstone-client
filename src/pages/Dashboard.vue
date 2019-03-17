<template>
  <div class="dashboard">
    <header class="header">
      <div class="logo">
        <img class="logo-image" src="../assets/logo.png" width="300px">
        Visual Research
      </div>
      <div class="filters">
        <div class="search-container">
          PMID:
          <input class="search-input">
        </div>
        <div class="search-container">
          Start Date:
          <input type="date" value="1990-01-01">
        </div>
        <div class="search-container">
          End Date:
          <input type="date" :value="currentDate()">
        </div>
        <div class="search-container">
          Minimum Cited:
          <input type="number" class="min-cited-input" value="10">
        </div>
      </div>
      <div class="panel-actions">
        <button class="square-btn">
          <font-awesome-icon icon="check-square"/>
        </button>
        <button class="square-btn">
          <font-awesome-icon icon="minus-square"/>
        </button>
      </div>
    </header>
    <div class="content">
      <div class="visualization">
        <d3-network :net-nodes="nodes" :net-links="links" :options="options" @node-click="clicky"></d3-network>
      </div>
      <div class="panel">
        <h1 class="publication-name">Publication Name</h1>
        <p class="publication-authors">Mario Luigi Waluigi</p>
        <p class="publication-date">01-01-2017</p>
        <p class="publication-rank">200</p>
        <h3 class="publication-abstract">Abstract</h3>
        <p
          class="publication-abstract-content"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <button class="publication-link">Link to Publication</button>
        <div class="publication-actions">
          <button>Favorite</button>
          <button>Hide</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import D3Network from "vue-d3-network";
import firebase from "firebase";
import { db } from "../main";

export default {
  name: "Dashboard",
  components: {
    D3Network
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
.header {
  height: 60px;
  width: 100%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #404040;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
}

.logo {
  display: flex;
  flex-direction: row;
  height: 30px;
  align-items: center;
  padding: 0 10px;
  background-color: #404040;
  height: 100%;
  color: #e6e6e6;
  font-weight: 600;
}

.logo-image {
  width: 30px;
  filter: invert(91%) sepia(8%) saturate(2724%) hue-rotate(319deg)
    brightness(97%) contrast(98%);
  margin-right: 5px;
}

.filters {
  display: flex;
  flex-direction: row;
  flex: 1;
  margin: 0 10px;
}

.filters > div {
  margin: 0 10px;
}

.content {
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 0;
  top: 61px;
  width: 100%;
}

.visualization {
  overflow: none;
}

input {
  align-self: center;
  margin: 10px 0;
  padding: 7px;
  background-color: transparent;
  border: 1px solid #e6e6e6;
  color: #404040;
  font-weight: 600;
}

.square-btn {
  color: #404040;
  font-weight: 900;
  border: none;
  font-size: 30px;
}

button {
  color: #404040;
  font-weight: 900;
  border: none;
  font-size: 30px;
}

.visualization {
  display: flex;
  flex: 1;
  height: 100%;
  background-color: #e6e6e6;
}

.panel {
  width: 380px;
  height: 100%;
  background-color: #404040;
  display: block;
  text-align: left;
  padding: 0 20px;
  color: #e6e6e6;
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
  width: inherit;
}

.publication-actions > button {
  width: 150px;
}
</style>
<style>
.net {
  width: 100%;
  height: 100;
}

svg {
  height: 99%;
  width: 99%;
}

path {
  stroke: brown;
}
</style>

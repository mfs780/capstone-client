import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { db } from "../main";
import firebase from "firebase";

Vue.use(Vuex);

let randomColor = (() => {
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
})();

let mergeByKeys = (keys, source, target) => {
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
};

export default new Vuex.Store({
  state: {
    selectedSearch: "",
    selectedNode: {},
    nodeMetaData: {},
    searches: {},
    nodes: [],
    links: [],
    isQuerying: false
  },
  actions: {
    setFirebase({ commit }, graph) {
      commit("setFirebase", { graph });
    },
    initState({ commit }, newState) {
      commit("initState", { newState });
    },
    selectNode({ commit }, node) {
      commit("setSelectedNode", { node });
    },
    selectSearch({ commit }, search) {
      commit("setSelectedSearch", { search });
    },
    removeSearch({ commit }, search) {
      commit("removeNodes", { search });
      commit("removeSearch", { search });
    },
    queryMetaData({ state, commit }, id) {
      if (state.isQuerying) {
        return;
      }
      commit("startQuerying");
      axios
        .get("https://rv-harvard-api-stage.herokuapp.com/v1/article/" + id)
        .then(res => {
          commit("setMetaData", { data: res.data });
          commit("stopQuerying");
        })
        .catch(err => {
          console.error(err);
          commit("setMetaData", {});
          commit("stopQuerying");
        });
    },
    queryNodes({ state, commit }, query) {
      if (state.isQuerying) {
        return;
      }
      commit("startQuerying");
      axios
        .post(
          "https://rv-harvard-api-stage.herokuapp.com/v1/graph/title",
          query
        )
        .then(res => {
          commit("setSearch", { query });
          commit("setNodes", { data: res.data, query: query });
          commit("stopQuerying");
        })
        .catch(err => {
          console.error(err);
          commit("setMetaData", {});
          commit("stopQuerying");
        });
    },
    visitNode({ commit }, node) {
      commit("setVisited", { node });
    },
    favoriteNode({ commit }, node) {
      commit("toggleFavorited", { node });
    }
  },
  mutations: {
    setFirebase(state, { graph }) {
      let newState = Object.assign({}, state);
      // newState.nodes = graph.nodes;
      // newState.links = graph.links;
      state.isQuerying = false;
      state.selectedNode = {};
      db.collection("dashboards")
        .doc(firebase.auth().currentUser.email)
        .set(newState);
    },
    removeNodes(state, { search }) {
      let nodes = [...state.nodes];
      let i = nodes.length;
      let nodeMap = {};

      while (i--) {
        let node = nodes[i];
        Vue.delete(node.searches, search);
        if (!Object.keys(node.searches).length && !node.isFavorite) {
          nodeMap[node.id] = true;
          nodes.splice(i, 1);
        }
      }

      let links = [...state.links];
      i = links.length;

      while (i--) {
        let link = links[i];
        if (nodeMap[link.source.id] || nodeMap[link.target.id]) {
          links.splice(i, 1);
        }
      }

      state.nodes = nodes;
      state.links = links;
    },
    removeSearch(state, { search }) {
      Vue.delete(state.searches, search);
    },
    startQuerying(state) {
      state.isQuerying = true;
    },
    stopQuerying(state) {
      state.isQuerying = false;
    },
    initState(state, { newState }) {
      Object.assign(state, newState);
    },
    setMetaData(state, { data }) {
      if (!data) {
        state.nodeMetaData = { msg: "No Metadata Available" };
        return;
      }

      state.nodeMetaData = data.article[0];
    },
    setNodes(state, { data, query }) {
      data.graph.nodes.forEach(node => {
        node.searches = node.searches || {};
        node.searches[query.title] = true;
      });

      state.nodes = mergeByKeys(["id"], state.nodes, data.graph.nodes);
      state.links = mergeByKeys(
        ["source", "target"],
        state.links,
        data.graph.links
      );
    },
    setSearch(state, { query }) {
      state.searches[query.title] =
        state.searches[query.title] || randomColor();
    },
    setSelectedNode(state, { node }) {
      state.selectedNode = node.id;
    },
    setSelectedSearch(state, { search }) {
      state.selectedSearch = state.selectedSearch === search ? "" : search;
    },
    setVisited(state, { node }) {
      node.isVisited = true;
      let index = state.nodes.findIndex(n => {
        return n.id == node.id;
      });
      if (index !== -1) {
        state.nodes[index] = node;
        state.nodes = [...state.nodes];
      }
    },
    toggleFavorited(state, { node }) {
      node.isFavorite = !node.isFavorite;
      let index = state.nodes.findIndex(n => {
        return n.id == node.id;
      });
      if (index !== -1) {
        state.nodes[index] = node;
        state.nodes = [...state.nodes];
      }
    }
  },
  getters: {
    graph: state => {
      return {
        nodes: state.nodes,
        links: state.links
      };
    },
    getNodeById: state => id => {
      return state.nodes.find(node => node.id === id);
    },
    getSelectedNode: (state, getters) => {
      return getters.getNodeById(state.selectNode);
    }
  }
});

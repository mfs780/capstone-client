import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

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
    selectedNode: undefined,
    nodeMetaData: {},
    searches: {},
    nodes: [],
    links: [],
    isQuerying: false
  },
  actions: {
    selectNode({ commit }, node) {
      commit("setSelectedNode", { node });
    },
    queryMetaData({ state, commit }, id) {
      if (state.isQuerying) {
        return;
      }
      commit("startQuerying");
      axios
        .get("https://rv-harvard-api-stage.herokuapp.com/article/" + id)
        .then(res => {
          console.log(res);
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
        .post("https://rv-harvard-api-stage.herokuapp.com/graph/title", query)
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
    startQuerying(state) {
      state.isQuerying = true;
    },
    stopQuerying(state) {
      state.isQuerying = false;
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
        if (node.search_returned_paper) {
          node._border = state.searches[query.title];
        }
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
        n.id == node;
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

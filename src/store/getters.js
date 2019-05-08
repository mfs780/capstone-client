let cloneObj = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

export default {
  graph: state => {
    return cloneObj({
      nodes: state.nodes,
      links: state.links
    });
  },
  getNodeById: state => id => {
    return state.nodes.find(node => node.id === id);
  },
  getSelectedNode: (state, getters) => {
    return getters.getNodeById(state.selectNode);
  }
}

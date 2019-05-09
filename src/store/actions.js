import axios from "axios";

let pollInterval;

export default {
  clearFirebase ({ commit }, ) {
    commit("clearFirebase");
  },
  initState ({ commit }, newState) {
    commit("initState", { newState });
  },
  favoriteNode ({ commit }, node) {
    commit("toggleFavorited", { node });
    commit("setFirebase");
  },
  selectNode ({ commit }, node) {
    commit("setSelectedNode", { node });
  },
  selectSearch ({ commit }, search) {
    commit("setSelectedSearch", { search });
  },
  setFirebase ({ commit }, ) {
    commit("setFirebase");
  },
  removeSearch ({ commit }, search) {
    commit("removeNodes", { search });
    commit("removeSearch", { search });
    commit("setFirebase");
  },
  queryMetaData ({ state, commit }, id) {
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
  queryNodes ({ state, dispatch, commit }, query) {
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
        console.info('Title Status:', res);
        if (!res.data.graph) {
          commit("setTask", { taskId: res.data.task_id, query: query });
          dispatch("queryTaskStatus");
        } else {
          commit("setSearch", { query });
          commit("setNodes", { data: res.data, query: query });
        }
        commit("stopQuerying");
      })
      .catch(err => {
        console.error(err);
        commit("setMetaData", {});
        commit("stopQuerying");
      });
  },
  queryTaskResult ({ state, commit }) {
    let task = state.tasks.pop();
    axios
      .get(
        `https://rv-harvard-api-stage.herokuapp.com/v1/graph/result/${task.taskId}`
      )
      .then(res => {
        console.info('Task Result', res);

        commit("setSearch", { query: task.query });
        commit("setNodes", { data: res.data, query: task.query });
      })
      .catch(err => {
        console.error(err);
      });
  },
  queryTaskStatus ({ state, dispatch }) {
    if (!state.tasks.length) {
      return;
    }

    pollInterval = setInterval(() => {
      if (!state.tasks.length) {
        clearInterval(pollInterval);
        return;
      }

      axios
        .get(
          `https://rv-harvard-api-stage.herokuapp.com/v1/graph/result/${state.tasks[0].taskId}/status`
        )
        .then(res => {
          console.info('Task Status', res);
          if (res.data.status === "finished") {
            dispatch('queryTaskResult');
          }
        })
        .catch(err => {
          console.error(err);
        });

    }, 5000);
  },
  visitNode ({ commit }, node) {
    if (!node.isVisited) {
      commit("setVisited", { node });
      commit("setFirebase");
    }
  },
}

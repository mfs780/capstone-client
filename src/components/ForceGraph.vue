<template>
  <svg ref="svg" class="force-graph">
    <g ref="everything" class="everything">
      <g ref="links" class="links"></g>
      <g ref="nodes" class="nodes"></g>
    </g>
  </svg>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ForceGraph",
  props: {
    netgraph: {
      type: Object
    }
  },

  data() {
    return {
      graph: {
        nodes: [],
        links: []
      },
      nodes: [],
      links: [],
      simulation: undefined
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    // load data
    loadData() {
      let height = this.$el.parentElement.offsetHeight;
      let width = this.$el.parentElement.offsetWidth;
      let nodes = this.graph.nodes;
      let links = this.graph.links;

      console.log(nodes);
      console.log(links);

      this.simulation = d3.forceSimulation();

      // Define Forces
      let link_force = d3.forceLink().id(d => {
        return d.id;
      });
      let charge_force = d3.forceManyBody().strength(-100);
      let center_force = d3.forceCenter(width / 2, height / 2);

      this.simulation
        .force("link", link_force)
        .force("charge", charge_force)
        .force("center", center_force);

      let link = d3
        .select(this.$refs.links)
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke-width", function(d) {
          return Math.sqrt(d.value);
        });

      let node = d3
        .select(this.$refs.nodes)
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", function(d) {
          return d._color || "brown";
        })
        .call(
          d3
            .drag()
            .on("start", this.dragstarted)
            .on("drag", this.dragged)
            .on("end", this.dragended)
        );

      node.append("title").text(function(d) {
        return d.id;
      });

      this.simulation.nodes(nodes).on("tick", () => this.ticked(link, node));

      this.simulation.force("link").links(links);

      this.initZoomOn(d3.select(this.$refs.svg));
    },
    ticked(link, node) {
      link
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

      node
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        })
        .on("click", d => {
          console.log(d);
          this.$emit("node-click", d);
        });
    },
    reload() {
      d3.select(this.$refs.links)
        .selectAll("*")
        .remove();
      d3.select(this.$refs.nodes)
        .selectAll("*")
        .remove();
      this.loadData();
    },
    initZoomOn($e) {
      let g = d3.select(this.$refs.everything);
      d3.zoom().on("zoom", () => {
        g.attr("transform", d3.event.transform);
      })($e);
    },
    dragstarted(d) {
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    },
    dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    },
    dragended(d) {
      if (!d3.event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    },
    mergeByKeys(keys, source, target) {
      console.log(keys);
      console.log(source);
      let src = Object.assign([], source);
      let trt = Object.assign([], target);
      trt.forEach(tE => {
        let isMatch = false;
        src.some((sE, index) => {
          isMatch = keys.every(key => {
            return tE[key] == sE[key];
          });
          if (isMatch) {
            src[index] = tE;
            return true;
          }
          return false;
        });

        if (!isMatch) {
          src.push(tE);
        }
      });

      console.log(src);
      return src;
    }
  },

  computed: {},

  watch: {
    netgraph() {
      console.log("watch");
      this.graph.nodes = this.mergeByKeys(
        ["id"],
        this.graph.nodes,
        this.netgraph.nodes
      );
      this.graph.links = this.mergeByKeys(
        ["source", "target"],
        this.graph.links,
        this.netgraph.links
      );
      this.nodes = [];
      this.links = [];
      this.reload();
    }
  }
};
</script>

<style scoped>
.force-graph {
  width: 100%;
  height: 100%;
  border: 1px solid red;
}
</style>

<style>
.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}
</style>

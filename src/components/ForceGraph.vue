<template>
  <svg ref="svg"
       class="force-graph">
    <g ref="everything"
       class="everything">
      <g ref="links"
         class="links"></g>
      <g ref="nodes"
         class="nodes"></g>
    </g>
  </svg>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import firebase from 'firebase'
import { db } from '../main'
import * as d3 from "d3";

export default {
  name: "ForceGraph",
  props: {
    netgraph: {
      type: Object
    }
  },

  data () {
    return {
      graph: {
        nodes: [],
        links: []
      },
      nodes: [],
      links: [],
      simulation: undefined,
      nodeColors: {
        visited: "white",
        favorite: "yellow"
      }
    };
  },

  mounted () {
    this.loadData();
  },

  methods: {
    ...mapActions([
      'setFirebase'
    ]),
    // load data
    loadData () {
      let height = this.$el.parentElement.offsetHeight;
      let width = this.$el.parentElement.offsetWidth;

      this.simulation = d3.forceSimulation();

      // Define Forces
      let link_force = d3.forceLink().id(d => {
        return d.id;
      });
      let charge_force = d3.forceManyBody().strength(-10);
      let center_force = d3.forceCenter(width / 2, height / 2);

      this.simulation
        .force("link", link_force)
        .force("charge", charge_force)
        .force("center", center_force)
        .force("collision", d3.forceCollide().radius(10));

      let link = d3
        .select(this.$refs.links)
        .selectAll("line")
        .data(this.graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function (d) {
          return Math.sqrt(d.value);
        });

      let node = d3
        .select(this.$refs.nodes)
        .selectAll("circle")
        .data(this.graph.nodes)
        .enter()
        .append("circle")
        .attr("r", this.getRadius)
        .attr("fill", this.getFillColor)
        .attr("stroke", this.getStrokeColor)
        .call(
          d3
            .drag()
            .on("start", this.dragstarted)
            .on("drag", this.dragged)
            .on("end", this.dragended)
        );

      node.append("title").text(function (d) {
        return d.id;
      });

      this.simulation.nodes(this.graph.nodes).on("tick", () => this.ticked(link, node)).stop();

      this.simulation.force("link").links(this.graph.links);

      d3.range(100).forEach(() => this.simulation.tick());
      this.ticked(link, node);

      this.simulation
        .force("link", null)
        .force("charge", null)
        .force("center", null)

      this.initZoomOn(d3.select(this.$refs.svg));
    },
    ticked (link, node) {
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        })
        .attr("fill", this.getFillColor)
        .attr("stroke", this.getStrokeColor)
        .attr("opacity", this.getOpacity)
        .on("click", d => {
          this.$emit("node-click", d);
        });
    },
    reload () {
      d3.select(this.$refs.links)
        .selectAll("*")
        .remove();
      d3.select(this.$refs.nodes)
        .selectAll("*")
        .remove();
      this.loadData();
    },
    initZoomOn ($e) {
      let g = d3.select(this.$refs.everything);
      d3.zoom().on("zoom", () => {
        g.attr("transform", d3.event.transform);
      })($e);
    },
    dragstarted (d) {
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    },
    dragged (d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    },
    dragended (d) {
      if (!d3.event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    },
    getRadius (d) {
      // return Math.min(d.rank / (this.max - this.min) * 5 + 5);
      return d.search_returned_paper ? 8 : 5;
    },
    getFillColor (d) {
      d._color = "#404040";
      if (d.isVisited) {
        d._color = this.nodeColors.visited;
      }
      if (d.isFavorite) {
        d._color = this.nodeColors.favorite;
      }
      return d._color;
    },
    getStrokeColor (d) {
      let search = Object.keys(d.searches)[0];
      if (d.search_returned_paper && search && this.searches[search]) {
        return this.searches[search];
      }
      return "white";
    },
    getOpacity (d) {
      return this.selectedSearch.length < 1 || d.searches[this.selectedSearch] ? 1 : 0.3;
    }
  },

  computed: {
    ...mapState([
      'searches',
      'selectedSearch'
    ]),
  },

  watch: {
    netgraph () {
      console.log('watch');
      if (this.graph.nodes.length !== this.netgraph.nodes.length) {
        this.netgraph.nodes.forEach(node => {
          // this.max = Math.max(this.max, node.rank);
          // this.min = Math.min(this.min, node.rank);
          delete node.fx;
          delete node.fy;
          delete node.vx;
          delete node.vy;
          delete node.y;
          delete node.x;
        });

        this.graph.nodes = this.netgraph.nodes;
        this.graph.links = this.netgraph.links;
        this.simulation.restart();
        this.reload();
        this.setFirebase();
      } else {
        this.graph.nodes = this.netgraph.nodes;
        this.graph.links = this.netgraph.links;
        this.reload();
      }
    },
    selectedSearch () {
      this.simulation.restart();
    }
  }
};
</script>

<style scoped>
.force-graph {
  width: 100%;
  height: 100%;
}
</style>

<style>
.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke-width: 1.5px;
}
</style>

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
import * as d3 from 'd3'

export default {
  name: 'ForceGraph',
  props: ["netnodes", "netlinks"],
  data () {
    return {
      simulation: null,
      radius: 15,
      data_nodes: [
        { "name": "Lillian", "sex": "F" },
        { "name": "Gordon", "sex": "M" },
        { "name": "Sylvester", "sex": "M" },
        { "name": "Mary", "sex": "F" },
        { "name": "Helen", "sex": "F" },
        { "name": "Jamie", "sex": "M" },
        { "name": "Jessie", "sex": "F" },
        { "name": "Ashton", "sex": "M" },
        { "name": "Duncan", "sex": "M" },
        { "name": "Evette", "sex": "F" },
        { "name": "Mauer", "sex": "M" },
        { "name": "Fray", "sex": "F" },
        { "name": "Duke", "sex": "M" },
        { "name": "Baron", "sex": "M" },
        { "name": "Infante", "sex": "M" },
        { "name": "Percy", "sex": "M" },
        { "name": "Cynthia", "sex": "F" },
        { "name": "Feyton", "sex": "M" },
        { "name": "Lesley", "sex": "F" },
        { "name": "Yvette", "sex": "F" },
        { "name": "Maria", "sex": "F" },
        { "name": "Lexy", "sex": "F" },
        { "name": "Peter", "sex": "M" },
        { "name": "Ashley", "sex": "F" },
        { "name": "Finkler", "sex": "M" },
        { "name": "Damo", "sex": "M" },
        { "name": "Imogen", "sex": "F" }
      ],
      data_links: [
        { "source": "Sylvester", "target": "Gordon", "type": "A" },
        { "source": "Sylvester", "target": "Lillian", "type": "A" },
        { "source": "Sylvester", "target": "Mary", "type": "A" },
        { "source": "Sylvester", "target": "Jamie", "type": "A" },
        { "source": "Sylvester", "target": "Jessie", "type": "A" },
        { "source": "Sylvester", "target": "Helen", "type": "A" },
        { "source": "Helen", "target": "Gordon", "type": "A" },
        { "source": "Mary", "target": "Lillian", "type": "A" },
        { "source": "Ashton", "target": "Mary", "type": "A" },
        { "source": "Duncan", "target": "Jamie", "type": "A" },
        { "source": "Gordon", "target": "Jessie", "type": "A" },
        { "source": "Sylvester", "target": "Fray", "type": "E" },
        { "source": "Fray", "target": "Mauer", "type": "A" },
        { "source": "Fray", "target": "Cynthia", "type": "A" },
        { "source": "Fray", "target": "Percy", "type": "A" },
        { "source": "Percy", "target": "Cynthia", "type": "A" },
        { "source": "Infante", "target": "Duke", "type": "A" },
        { "source": "Duke", "target": "Gordon", "type": "A" },
        { "source": "Duke", "target": "Sylvester", "type": "A" },
        { "source": "Baron", "target": "Duke", "type": "A" },
        { "source": "Baron", "target": "Sylvester", "type": "E" },
        { "source": "Evette", "target": "Sylvester", "type": "E" },
        { "source": "Cynthia", "target": "Sylvester", "type": "E" },
        { "source": "Cynthia", "target": "Jamie", "type": "E" },
        { "source": "Mauer", "target": "Jessie", "type": "E" },
        { "source": "Duke", "target": "Lexy", "type": "A" },
        { "source": "Feyton", "target": "Lexy", "type": "A" },
        { "source": "Maria", "target": "Feyton", "type": "A" },
        { "source": "Baron", "target": "Yvette", "type": "E" },
        { "source": "Evette", "target": "Maria", "type": "E" },
        { "source": "Cynthia", "target": "Yvette", "type": "E" },
        { "source": "Maria", "target": "Jamie", "type": "E" },
        { "source": "Maria", "target": "Lesley", "type": "E" },
        { "source": "Ashley", "target": "Damo", "type": "A" },
        { "source": "Damo", "target": "Lexy", "type": "A" },
        { "source": "Maria", "target": "Feyton", "type": "A" },
        { "source": "Finkler", "target": "Ashley", "type": "E" },
        { "source": "Sylvester", "target": "Maria", "type": "E" },
        { "source": "Peter", "target": "Finkler", "type": "E" },
        { "source": "Ashley", "target": "Gordon", "type": "E" },
        { "source": "Maria", "target": "Imogen", "type": "E" }

      ],
      link_force: null,
      charge_force: null,
      center_force: null,
      size: d3.scalePow().exponent(1).domain([1, 100]).range([8, 24])
    }
  },
  methods: {
    drag_start (d) {
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    },
    drag_drag (d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    },
    drag_end (d) {
      if (!d3.event.active) this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    },
    circleColour (d) {
      return "black";
    },
    linkColour (d) {
      return "brown";
    },
    initDragOn ($e) {
      d3.drag()
        .on("start", this.drag_start)
        .on("drag", this.drag_drag)
        .on("end", this.drag_end)($e);
    },
    initZoomOn ($e) {
      let g = d3.select(this.$refs.everything);
      d3.zoom().on("zoom", () => {
        g.attr("transform", d3.event.transform)
      })($e);
    }
  },
  mounted () {
    let height = this.$el.parentElement.offsetHeight;
    let width = this.$el.parentElement.offsetWidth;

    this.simulation = d3.forceSimulation().nodes(this.data_nodes);

    this.link_force = d3.forceLink(this.data_links)
      .id(function (d) { return d.name; });
    this.charge_force = d3.forceManyBody().strength(-100);
    this.center_force = d3.forceCenter(width / 2, height / 2);

    this.simulation
      .force("charge_force", this.charge_force)
      .force("center_force", this.center_force)
      .force("links", this.link_force);

    this.simulation.on("tick", () => {
      this.nodes
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .on("click", (d) => {
          this.$emit("node-click", d);
        });

      this.links
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });
    });

    this.initDragOn(this.nodes);

    this.initZoomOn(d3.select(this.$refs.svg));
  },

  computed: {
    nodes () {
      return d3.select(this.$refs.nodes)
        .selectAll("circle")
        .data(this.data_nodes)
        .enter()
        .append("circle")
        .attr("r", this.radius)
        .style("fill", this.circleColour)
    },
    links () {
      return d3.select(this.$refs.links)
        .selectAll("line")
        .data(this.data_links)
        .enter()
        .append("line")
        .attr("stroke-width", 2)
        .style("stroke", this.linkColour);
    }
  }
}
</script>

<style scoped>
.force-graph {
  width: 100%;
  height: 100%;
  border: 1px solid red;
}
</style>

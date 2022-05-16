import "./style.css";
import * as d3 from "d3";
//initilize svg or grab svg
const svg = d3.select("svg");
const width = svg.attr("width");
const height = svg.attr("height");

//intialize data
const graph = {
  nodes: [
    { name: "Alice" },
    { name: "Bob" },
    { name: "Chen" },
    { name: "Dawg" },
    { name: "Ethan" },
    { name: "George" },
    { name: "Frank" },
    { name: "Hanes" },
  ],
  links: [
    { source: "Alice", target: "Bob" },
    { source: "Chen", target: "Bob" },
    { source: "Dawg", target: "Chen" },
    { source: "Hanes", target: "Frank" },
    { source: "Hanes", target: "George" },
    { source: "Dawg", target: "Ethan" },
  ],
};

const simulation = d3
  .forceSimulation(graph.nodes)
  .force(
    "link",
    d3
      .forceLink()
      .id(function (d) {
        return d.name;
      })
      .links(graph.links)
  )

  .force("charge", d3.forceManyBody().strength(-30))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .on("tick", ticked);

const link = svg
  .append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter()
  .append("line")
  .attr("stroke-width", function (d) {
    return 3;
  });

const node = svg
  .append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(graph.nodes)
  .enter()
  .append("circle")
  .attr("r", 5)
  .attr("fill", function (d) {
    return "red";
  })
  .call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

function ticked() {
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
    });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

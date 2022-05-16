import "./style.css";
import * as d3 from "d3";

import * as regression from "d3-regression";

let widthRaw = window.innerWidth < 420 ? 380 : 520;
const margin = { top: 60, right: 30, bottom: 230, left: 60 },
  width = widthRaw - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// compare
const compare = d3
  .select("#compare")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.top / 2)

  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// append the svg object to the body of the page
const active = d3
  .select("#active")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("/top2012_active.csv").then(function (data) {
  // console.log(data);
  // X axis

  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data.map(function (d) {
        return d.project;
      })
    )
    .padding(0.2);
  active
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 10]).range([height, 0]);
  active.append("g").call(d3.axisLeft(y));

  compare
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#0891b2")
    .attr("stroke-width", 4)
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveMonotoneX)
        .x(function (d) {
          return x(d.project);
        })
        .y(function (d) {
          return y(d.cite_count);
        })
    );

  // Bars
  active
    .selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .style("fill", "#0891b2")
    .attr("x", function (d) {
      return x(d.project);
    })
    .attr("y", function (d) {
      return y(d.cite_count);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.cite_count);
    });

  active
    .append("text")
    .attr("x", width / 2)
    .attr("y", "-.67rem")
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("font-weight", "900")
    .text("10 Most Cited Active Projects");
});
// -------------------

const inactive = d3
  .select("#inactive")

  .append("svg")

  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// Parse the Data
d3.csv("/top2012_inactive.csv").then(function (data) {
  // X axis

  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data.map(function (d) {
        return d.project;
      })
    )
    .padding(0.2);
  inactive
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLinear().domain([0, 10]).range([height, 0]);
  inactive.append("g").call(d3.axisLeft(y));

  compare
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#c2410c")
    .attr("stroke-width", 4)
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveMonotoneX)
        .x(function (d) {
          return x(d.project);
        })
        .y(function (d) {
          // console.log(r.y(d.cite_count[0]));
          return y(d.cite_count);
        })
    );

  compare
    .append("text")
    .attr("x", width / 2)
    .attr("y", "-.67rem")
    .attr("text-anchor", "middle")

    .style("font-size", "16px")
    .attr("font-weight", "900")
    .text("Comparison of Trend Lines");
  compare.append("g").call(d3.axisLeft(y));

  //  EVERTYHING IS HERE!!!
  const r = regression
    .regressionPoly()
    .x((d, i) => i) // only can get valid data with real co-efficients if i use the index, but the scale is a discrete band
    .y((d, i) => d.cite_count)
    .order(3);
  const regressionData = r(data);
  console.log(regressionData);

  compare.append("path");
  // assuming I can use the index I want to plot the line ... im starting to think I cant use regression

  formatCompare(data);
});

inactive
  .append("text")
  .attr("x", width / 2)

  .attr("y", "-1rem")
  .attr("text-anchor", "middle")
  .attr("font-weight", "900")
  .style("font-size", "16px")
  .text("10 Most Cited Inactive Projects");

d3.selectAll("svg")

  .on("mouseover", function (d, i) {
    d3.select(this).style("background", "white");
  })
  .on("mouseout", function (d, i) {
    d3.select(this).style("background", "#e7e5e4");
  });
function formatCompare(data) {
  compare
    .append("circle")
    .attr("cx", width / 2 - 15)
    .attr("cy", 25)
    .attr("r", 6)
    .style("fill", "#0891b2");

  compare
    .append("text")
    .attr("x", width / 2)
    .attr("y", 29)
    .text("Most Cited Active Projects")
    .style("fill", "#0891b2")
    .style("font-size", "13px")
    .attr("alignment-baseline", "center");

  compare
    .append("circle")
    .attr("cx", width / 2 - 15)
    .attr("cy", 55)
    .attr("r", 6)
    .style("fill", "#c2410c");

  compare
    .append("text")
    .attr("x", width / 2)
    .attr("y", 58)
    .text("Most Cited Inactive Projects")
    .style("fill", "#c2410c")
    .style("font-size", "13px")
    .attr("alignment-baseline", "center");
}

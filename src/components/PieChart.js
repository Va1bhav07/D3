import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import fifaData from "./helper";

const yearsList = [
  { year: 2018 },
  { year: 2019 },
  { year: 2020 },
  { year: 2021 },
  { year: 2022 },
];

const PieChart = () => {
  const [selectedYear, setSelectedYear] = useState(2018);
  useEffect(() => {
    const filteredData = fifaData.filter((item) => item.year === selectedYear);

    const colorScale = d3
      .scaleOrdinal()
      .domain(filteredData.map((item) => item.player))
      .range(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d.goals);

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const svg = d3
      .select("#pie-chart-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150}, 20)`)
      .selectAll(".legend")
      .data(filteredData.map((item) => item.player))
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d) => colorScale(d));

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text((d) => d);

    const tooltip = d3
      .select("#pie-chart-container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const updateChart = (data) => {
      const arcs = svg.selectAll("arc").data(pie(data));

      const arcEnter = arcs
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", function (event, d) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(`${d.data.player} - ${d.data.accuracy}%`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      arcEnter
        .append("path")
        .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
        .attr("fill", (d) => colorScale(d.data.player))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .on("click", (event, d) => {
          console.log("Clicked on:", d.data.player);
        });

      arcs.attr("d", d3.arc().innerRadius(0).outerRadius(radius));

      arcs.exit().remove();
    };

    updateChart(filteredData);

    return () => {
      const chartContainer = d3.select("#pie-chart-container");
      chartContainer.selectAll("*").remove();
    };
  }, [selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#f0f0f0",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3
        style={{
          color: "darkblue",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Players Accuracy Comparison 2018-2022
      </h3>
      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="year-select"
          style={{ color: "darkblue", marginRight: "10px" }}
        >
          Select Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          <option value="All">All Players</option>
          {yearsList.map((d) => (
            <option key={d.year} value={d.year}>
              {d.year}
            </option>
          ))}
        </select>
      </div>
      <div id="pie-chart-container" />
    </div>
  );
};

export default PieChart;

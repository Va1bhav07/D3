import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import fifaData from "./helper";

const GroupedBarChart = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const players = [...new Set(fifaData.map((d) => d.player))];
    const years = [...new Set(fifaData.map((d) => d.year))];

    const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(fifaData, (d) => d.speed)])
      .range([height, 0]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(players)
      .range(d3.schemeCategory10);

    const playerGroups = svg
      .selectAll(".playerGroup")
      .data(players)
      .enter()
      .append("g")
      .attr("class", "playerGroup");

    playerGroups
      .selectAll("rect")
      .data((player) => fifaData.filter((d) => d.player === player))
      .enter()
      .append("rect")
      .attr(
        "x",
        (d) =>
          xScale(d.year) +
          (xScale.bandwidth() / players.length) * players.indexOf(d.player)
      )
      .attr("y", (d) => yScale(d.speed))
      .attr("width", xScale.bandwidth() / players.length)
      .attr("height", (d) => height - yScale(d.speed))
      .attr("fill", (d) => colorScale(d.player))
      .style("opacity", (d) =>
        selectedPlayer ? (d.player === selectedPlayer ? 1 : 0.5) : 1
      )
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`${d.player}: ${d.speed} km/h`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        d3.select(tooltipRef.current)
          .transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", (event, d) => {
        setSelectedPlayer((prev) => (prev === d.player ? null : d.player));
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));
  }, [fifaData, selectedPlayer]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h3 className="align-items-center">
        Players Speed Based Comparison 2018-2023
      </h3>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          padding: "10px",
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          pointerEvents: "none",
          opacity: 0,
        }}
      ></div>
    </div>
  );
};

export default GroupedBarChart;

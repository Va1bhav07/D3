import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import fifaData from "./helper";

const playersList = [
  { player: "Messi" },
  { player: "Ronaldo" },
  { player: "Kylian Mbappé" },
  { player: "Neymar" },
  { player: "Robert Lewandowski" },
];

const HierarchicalBarChart = () => {
  const [selectedPlayer, setSelectedPlayer] = useState("All");
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const existingChart = d3.select(chartContainerRef.current);
    existingChart.selectAll("*").remove();
    const svg = d3.select(chartContainerRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const groupedData = d3.group(fifaData, (d) => d.player);

    const playersData = Array.from(groupedData, ([key, value]) => ({
      player: key,
      totalGoals: d3.sum(value, (d) => d.goals),
      years: Array.from(value, (d) => ({ year: d.year, goals: d.goals })),
    }));

    playersData.sort((a, b) => b.totalGoals - a.totalGoals);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleBand().range([height, 0]).padding(0.1);

    xScale.domain([0, d3.max(playersData, (d) => d.totalGoals)]);
    yScale.domain(playersData.map((d) => d.player));

    const filteredData =
      selectedPlayer === "All"
        ? playersData
        : playersData.filter((d) => d.player === selectedPlayer);

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .selectAll(".bar")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", (d) => xScale(d.totalGoals))
      .attr("height", yScale.bandwidth())
      .attr("y", (d) => yScale(d.player))
      .attr("fill", (d) => colorScale(d.player));

    svg
      .selectAll(".player-label")
      .data(filteredData)
      .enter()
      .append("text")
      .attr("class", "player-label")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.player) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .style("fill", "white")
      .text((d) => `${d.player}: ${d.totalGoals} goals`);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 30)
      .style("text-anchor", "middle")
      .attr("fill", "darkblue")
      .text("Total Goals");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Players");

    return () => {
      existingChart.selectAll("*").remove();
    };
  }, [selectedPlayer]);

  const handlePlayerChange = (event) => {
    setSelectedPlayer(event.target.value);
  };

  return (
    <div>
      <h3 className="align-items-center">
        Player Goals Based Comparison 2018-2022
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "darkblue" }}>Select Player: </label>
          <select value={selectedPlayer} onChange={handlePlayerChange}>
            <option value="All">All Players</option>
            {playersList.map((d) => (
              <option key={d.player} value={d.player}>
                {d.player}
              </option>
            ))}
          </select>
        </div>
        <div
          className="tooltip"
          style={{ opacity: 0, position: "absolute" }}
        ></div>
        <svg ref={chartContainerRef} width={600} height={400}></svg>
      </div>
    </div>
  );
};

export default HierarchicalBarChart;

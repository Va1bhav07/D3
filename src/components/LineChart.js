import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import fifaData from "./helper";

const LineChart = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 30, left: 140 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);

    const uniqueYears = Array.from(new Set(fifaData.map((d) => d.year)));

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(uniqueYears.map((year) => year.toString()))
      .padding(0.1);

    const y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

    const line = d3
      .line()
      .x((d) => x(d.year.toString()) + x.bandwidth() / 2)
      .y((d) => y(d.strength))
      .curve(d3.curveMonotoneX);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    const yAxis = svg.append("g").call(d3.axisLeft(y).ticks(10));

    yAxis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .text("Strength");

    svg
      .selectAll(".tick text")
      .attr("transform", "translate(-8,0)")
      .style("text-anchor", "end")
      .attr("dy", "0.35em");

    const players = Array.from(new Set(fifaData.map((d) => d.player)));

    const legend = svg
      .selectAll(".legend")
      .data(players)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        (d, i) => `translate(${width + 20}, ${i * 32 + margin.top})`
      )
      .on("click", (event, d) => togglePlayer(d));

    legend
      .append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => d3.schemeCategory10[i]);

    legend
      .append("text")
      .attr("x", -6)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => d);

    const dot = svg
      .selectAll(".dot")
      .data(fifaData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.year.toString()) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.strength))
      .attr("r", 5)
      .style("fill", (d) => d3.schemeCategory10[players.indexOf(d.player)])
      .style("display", "initial")
      .on("mouseover", (event, d) => {
        const isHidden =
          svg.select(`path[data-player="${d.player}"]`).style("display") ===
          "none";

        if (!isHidden) {
          const tooltip = svg.append("g").attr("class", "tooltip");
          tooltip
            .append("rect")
            .attr("x", x(d.year.toString()) + x.bandwidth() / 2 - 30)
            .attr("y", y(d.strength) - 25)
            .attr("width", 60)
            .attr("height", 20)
            .style("fill", "white")
            .style("stroke", "black");
          tooltip
            .append("text")
            .attr("x", x(d.year.toString()) + x.bandwidth() / 2)
            .attr("y", y(d.strength) - 15)
            .style("text-anchor", "middle")
            .text(`Strength: ${d.strength}`);
        }
      })
      .on("mouseout", () => {
        svg.selectAll(".tooltip").remove();
      });

    const lines = players.map((player) => {
      const playerData = fifaData.filter((d) => d.player === player);
      return {
        player,
        line: svg
          .append("path")
          .data([playerData])
          .attr("fill", "none")
          .attr("stroke", () => d3.schemeCategory10[players.indexOf(player)])
          .attr("stroke-width", 2)
          .attr("d", line)
          .attr("data-player", player),
      };
    });

    function togglePlayer(player) {
      const index = lines.findIndex((line) => line.player === player);
      const line = lines[index].line;
      const dot = svg.selectAll(`.dot[data-player="${player}"]`);

      const isHidden = line.style("display") === "none";
      line.style("display", isHidden ? "initial" : "none");
      dot.style("display", isHidden ? "initial" : "none");
    }

    const resetButton = svg
      .append("rect")
      .attr("x", width + 20)
      .attr("y", players.length * 32 + margin.top + 10)
      .attr("width", 60)
      .attr("height", 20)
      .style("fill", "gray")
      .style("cursor", "pointer")
      .on("click", () => {
        lines.forEach((line) => {
          line.line.style("display", "initial");
        });
        svg.selectAll(".dot").style("display", "initial");
      });

    svg
      .append("text")
      .attr("x", width + 50)
      .attr("y", players.length * 32 + margin.top + 22)
      .style("text-anchor", "middle")
      .style("cursor", "pointer")
      .text("Reset")
      .on("click", () => {
        lines.forEach((line) => {
          line.line.style("display", "initial");
        });
        svg.selectAll(".dot").style("display", "initial");
      });
  }, []);

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
        Player Strength Based Comparison 2018-2022
      </h3>
      <svg ref={svgRef} width={600} height={400}>
        <g />
        <g />
      </svg>
    </div>
  );
};

export default LineChart;

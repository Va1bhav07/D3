import * as d3 from "d3";
import { INNER_RADIUS, RadarGrid } from "./RadarGrid";
import { useState } from "react";
import fifaData from "./helper";

const MARGIN = 30;

export const Radar = ({ axisConfig }) => {
  const players = [...new Set(fifaData.map((d) => d.player))];

  const [selectedPlayerState, setSelectedPlayer] = useState({});

  const width = 500;
  const height = 500;
  const outerRadius = Math.min(width, height) / 2 - MARGIN;

  const handlerPlayerChange = (e) => {
    const playerName = e.target.value;
    const selectedPlayer = fifaData.find(
      (player) => player.player === playerName
    );
    console.log("playerData :>> ", playerName, selectedPlayer);
    setSelectedPlayer(selectedPlayer);
  };

  // The x scale provides an angle for each variable of the dataset
  const allVariableNames = axisConfig.map((axis) => axis.name);
  const xScale = d3
    .scaleBand()
    .domain(allVariableNames)
    .range([0, 2 * Math.PI]);

  // Compute the y scales: 1 scale per variable.
  // Provides the distance to the center.
  let yScales = {};
  axisConfig.forEach((axis) => {
    yScales[axis.name] = d3
      .scaleRadial()
      .domain([0, axis.max])
      .range([INNER_RADIUS, outerRadius]);
  });

  // Compute the main radar shapes, 1 per group
  const lineGenerator = d3.lineRadial();

  const allCoordinates = axisConfig.map((axis) => {
    const yScale = yScales[axis.name];
    const angle = xScale(axis.name) ?? 0;
    console.log("axis :>> ", axis, selectedPlayerState[axis.name]);
    const radius = yScale(selectedPlayerState[axis.name]);
    const coordinate = [angle, radius];
    return coordinate;
  });

  console.log("allCoordinates :>> ", allCoordinates);

  allCoordinates.push(allCoordinates[0]);
  const linePath = lineGenerator(allCoordinates);

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
        Players Comparison 2018-2022
      </h3>
      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="year-select"
          style={{ color: "darkblue", marginRight: "10px" }}
        >
          Select Player:
        </label>
        <select
          id="year-select"
          value={selectedPlayerState?.player}
          onChange={handlerPlayerChange}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          <option value="">select player</option>
          {players.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <svg width={width} height={height} style={{ color: "black" }}>
        <g transform={"translate(" + width / 2 + "," + height / 2 + ")"}>
          <RadarGrid
            outerRadius={outerRadius}
            xScale={xScale}
            axisConfig={axisConfig}
          />
          <path
            d={linePath}
            stroke={"#cb1dd1"}
            strokeWidth={3}
            fill={"#cb1dd1"}
            fillOpacity={0.1}
          />
        </g>
      </svg>
    </div>
  );
};

import { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import fifaData from "../helper";

const MARGIN = 30;

const yearsList = [
  { year: 2018 },
  { year: 2019 },
  { year: 2020 },
  { year: 2021 },
  { year: 2022 },
];

const INFLEXION_PADDING = 20;

const colors = [
  "#e0ac2b",
  "#e85252",
  "#6689c6",
  "#9a6fb0",
  "#a53253",
  "#69b3a2",
];
const players = [...new Set(fifaData.map((d) => d.player))];

export const DonutChart = () => {
  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2 - MARGIN;
  const innerRadius = radius / 2;

  const [selectedYear, setSelectedYear] = useState(2018);
  const [playerDataState, setPlayerDataState] = useState([]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  useEffect(() => {
    const playerData = players.map((data) => {
      const player = fifaData.find(
        (value) => value.player === data && value.year === selectedYear
      );
      console.log("playerplayer :>> ", player);
      return {
        name: player?.player,
        goals: player?.goals,
      };
    });
    setPlayerDataState(playerData);
  }, [selectedYear]);

  //   { name: d.player, goals: d.goals }

  console.log("players :>> ", playerDataState);

  const pie = useMemo(() => {
    const pieGenerator = d3.pie().value((d) => d?.goals);
    return pieGenerator(playerDataState);
  }, [playerDataState]);

  const arcGenerator = d3.arc();

  const shapes = pie.map((grp, i) => {
    // First arc is for the donut
    const sliceInfo = {
      innerRadius,
      outerRadius: radius,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const centroid = arcGenerator.centroid(sliceInfo);
    const slicePath = arcGenerator(sliceInfo);

    // Second arc is for the legend inflexion point
    const inflexionInfo = {
      innerRadius: radius + INFLEXION_PADDING,
      outerRadius: radius + INFLEXION_PADDING,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const inflexionPoint = arcGenerator.centroid(inflexionInfo);

    const isRightLabel = inflexionPoint[0] > 0;
    const labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
    const textAnchor = isRightLabel ? "start" : "end";
    const label = grp.data.name + " (" + grp.value + ")";

    return (
      <g key={i}>
        <path d={slicePath} fill={colors[i]} />
        <circle cx={centroid[0]} cy={centroid[1]} r={2} />
        <line
          x1={centroid[0]}
          y1={centroid[1]}
          x2={inflexionPoint[0]}
          y2={inflexionPoint[1]}
          stroke={"black"}
          fill={"black"}
        />
        <line
          x1={inflexionPoint[0]}
          y1={inflexionPoint[1]}
          x2={labelPosX}
          y2={inflexionPoint[1]}
          stroke={"black"}
          fill={"black"}
        />
        <text
          x={labelPosX + (isRightLabel ? 2 : -2)}
          y={inflexionPoint[1]}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={14}
        >
          {label}
        </text>
      </g>
    );
  });

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
        Players Goals 2018-2022
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
      <svg width={800} height={400} style={{ display: "inline-block" }}>
        <g transform={`translate(${800 / 2}, ${400 / 2})`}>{shapes}</g>
      </svg>
    </div>
  );
};
